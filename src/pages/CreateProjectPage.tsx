import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, DollarSign, Loader, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultipleTextInputs } from "@/components/ui/MultipleTextInputs";
import { parseDecimalToBigInt } from "@/lib/convertDecimals";
import { useNetworkVariable } from "@/networkConfig";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const vanalisPackageId = useNetworkVariable("vanalisPackageId");
  const projectRegistryObjectId = useNetworkVariable("projectRegistryObjectId");
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute, isPending } =
    useSignAndExecuteTransaction();

  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    description: "",
    dataType: "",
    category: "",
    deadline: "",
    goal: "",
    rewardPool: "",
    requirements: [] as string[],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) return;

    const totalBase = parseDecimalToBigInt(form.rewardPool);
    if (totalBase == null || totalBase <= 0n) {
      console.error("Reward pool must be > 0");
      return;
    }

    const targetSubmissions = BigInt(form.goal || "0");
    if (targetSubmissions === 0n) {
      console.error("Goal must be > 0");
      return;
    }

    const rewardPerBase = totalBase / targetSubmissions;
    if (rewardPerBase === 0n) {
      console.warn(
        "Calculated rewardPerSubmission is 0 — increase total reward or reduce goal",
      );
    }
    const ts = Date.parse(form.deadline);
    if (Number.isNaN(ts)) {
      console.error("Invalid deadline");
      return;
    }

    if (ts <= Date.now()) {
      console.error("Deadline must be in the future");
      return;
    }

    const deadlineMs = BigInt(ts);

    const { totalBalance } = await suiClient.getBalance({
      owner: account.address,
      coinType: "0x2::sui::SUI",
    });
    
    if (BigInt(totalBalance) < totalBase) {
      console.error("Not enough SUI to create project");
      return;
    }

    setIsLoading(true);

    try {
      const tx = new Transaction();

      const rewardCoin = tx.splitCoins(tx.gas, [tx.pure.u64(totalBase)]);
      console.log(
        vanalisPackageId,
        projectRegistryObjectId,
        form.title,
        form.description,
        form.requirements,
        form.dataType,
        form.category,
        form.imageUrl,
        rewardCoin,
        rewardPerBase,
        targetSubmissions,
        deadlineMs,
      );
      tx.moveCall({
        target: `${vanalisPackageId}::project::create_project`,
        arguments: [
          tx.object(projectRegistryObjectId),
          tx.pure.string(form.title),
          tx.pure.string(form.description),
          tx.pure.vector("string", form.requirements),
          tx.pure.string(form.dataType),
          tx.pure.string(form.category),
          tx.pure.string(form.imageUrl),
          rewardCoin,
          tx.pure.u64(rewardPerBase),
          tx.pure.u64(targetSubmissions),
          tx.pure.u64(deadlineMs),
          tx.object("0x6"),
        ],
      });
      try {
        const executionResult = await signAndExecute({ transaction: tx });
        const { digest } = executionResult;

        await suiClient.waitForTransaction({
          digest,
          options: {
            showEffects: true,
            showEvents: true,
            showBalanceChanges: true,
          },
        });

        navigate("/my-projects");
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loading = isLoading || isPending;

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
          <p className="text-muted-foreground">
            Start a crowdsourced data collection project
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>
                Provide details about your data collection project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Project Title <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Medical Image Dataset Collection"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">
                  Image URL <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="image_url"
                  placeholder="e.g., https://example.com/image.png"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm((f) => ({ ...f, category: value }))
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="nlp">
                      Natural Language Processing
                    </SelectItem>
                    <SelectItem value="cv">Computer Vision</SelectItem>
                    <SelectItem value="audio">Audio & Speech</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what data you're collecting and how it will be used..."
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_type">
                  Data Type <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={form.dataType}
                  onValueChange={(value) =>
                    setForm((f) => ({ ...f, dataType: value }))
                  }
                >
                  <SelectTrigger id="data_type">
                    <SelectValue placeholder="Select Data Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="txt">TXT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <MultipleTextInputs
                  label="Submission Requirements"
                  values={form.requirements}
                  onValuesChange={(value) =>
                    setForm((f) => ({ ...f, requirements: value }))
                  }
                  placeholder="Describe the requirements..."
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter each requirement on a new line
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rewards & Timeline</CardTitle>
              <CardDescription>
                Set up rewards and project timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rewardPool">
                    Total Reward Pool (SUI){" "}
                    <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="rewardPool"
                      type="number"
                      placeholder="5000"
                      className="pl-10"
                      value={form.rewardPool}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, rewardPool: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Amount to be distributed to contributors
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">
                    Submission Goal <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="goal"
                      type="number"
                      placeholder="1000"
                      className="pl-10"
                      value={form.goal}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, goal: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Target number of submissions
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">
                  Deadline <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="deadline"
                    type="date"
                    className="pl-10"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, deadline: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-1">Review & Submit</h4>
                  <p className="text-sm text-muted-foreground">
                    Create your project and start collecting data
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/projects")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader className="animate-spin w-7" />
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
