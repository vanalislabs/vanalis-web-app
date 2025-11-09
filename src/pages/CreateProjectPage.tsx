import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, DollarSign, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    rewardPool: "",
    deadline: "",
    goal: "",
    requirements: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating project:", formData);
    //todo: remove mock functionality - replace with actual API call
    navigate("/my-projects");
  };

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
          <p className="text-muted-foreground">Start a crowdsourced data collection project</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Provide details about your data collection project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Medical Image Dataset Collection"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  data-testid="input-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="category" data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="nlp">Natural Language Processing</SelectItem>
                    <SelectItem value="cv">Computer Vision</SelectItem>
                    <SelectItem value="audio">Audio & Speech</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what data you're collecting and how it will be used..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  data-testid="input-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Submission Requirements *</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the requirements for submissions (one per line)..."
                  rows={6}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  required
                  data-testid="input-requirements"
                />
                <p className="text-sm text-muted-foreground">Enter each requirement on a new line</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rewards & Timeline</CardTitle>
              <CardDescription>Set up rewards and project timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rewardPool">Total Reward Pool (SUI) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="rewardPool"
                      type="number"
                      placeholder="5000"
                      className="pl-10"
                      value={formData.rewardPool}
                      onChange={(e) => setFormData({ ...formData, rewardPool: e.target.value })}
                      required
                      data-testid="input-reward-pool"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Amount to be distributed to contributors</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Submission Goal *</Label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="goal"
                      type="number"
                      placeholder="1000"
                      className="pl-10"
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      required
                      data-testid="input-goal"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Target number of submissions</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="deadline"
                    type="date"
                    className="pl-10"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                    data-testid="input-deadline"
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
                  <p className="text-sm text-muted-foreground">Create your project and start collecting data</p>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate("/projects")} data-testid="button-cancel">
                    Cancel
                  </Button>
                  <Button type="submit" data-testid="button-create-project">
                    Create Project
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
