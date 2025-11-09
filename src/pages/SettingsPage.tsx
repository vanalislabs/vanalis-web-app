import { useState } from "react";
import { User, Wallet, Bell, Shield, Key } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import avatarImage from "@assets/dummy/Tech_professional_avatar_headshot_e62e7352.png";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function SettingsPage() {
  const account = useCurrentAccount();

  const [notifications, setNotifications] = useState({
    submissions: true,
    purchases: true,
    verifications: true,
    rewards: false,
  });

  if (!account) {
    return <div>Wallet not connected</div>;
  }

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="wallet" data-testid="tab-wallet">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" data-testid="tab-privacy">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile details and avatar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarImage} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" data-testid="button-change-avatar">Change Avatar</Button>
                    <p className="text-sm text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="john.sui" data-testid="input-username" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    rows={4}
                    defaultValue="AI/ML enthusiast, data contributor, and dataset curator."
                    data-testid="input-bio"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" data-testid="input-email" />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" data-testid="button-cancel-profile">Cancel</Button>
                  <Button data-testid="button-save-profile">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Connection</CardTitle>
                <CardDescription>Manage your connected wallets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Sui Wallet</div>
                      <div className="text-sm text-muted-foreground">{account.address}</div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                      Connected
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>For trainers to access purchased datasets programmatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Production API Key</span>
                    </div>
                    <Button variant="ghost" size="sm" data-testid="button-reveal-key">Reveal</Button>
                  </div>
                  <div className="font-mono text-sm bg-muted p-2 rounded">••••••••••••••••••••••••••••••••</div>
                </div>

                <Button variant="outline" className="w-full" data-testid="button-generate-key">
                  Generate New API Key
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">New Submissions</div>
                    <div className="text-sm text-muted-foreground">Get notified when someone submits to your projects</div>
                  </div>
                  <Switch
                    checked={notifications.submissions}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, submissions: checked })}
                    data-testid="switch-submissions"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Dataset Purchases</div>
                    <div className="text-sm text-muted-foreground">Get notified when someone purchases your datasets</div>
                  </div>
                  <Switch
                    checked={notifications.purchases}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, purchases: checked })}
                    data-testid="switch-purchases"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Submission Verifications</div>
                    <div className="text-sm text-muted-foreground">Get notified when your submissions are verified</div>
                  </div>
                  <Switch
                    checked={notifications.verifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, verifications: checked })}
                    data-testid="switch-verifications"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Reward Distributions</div>
                    <div className="text-sm text-muted-foreground">Get notified when you receive rewards</div>
                  </div>
                  <Switch
                    checked={notifications.rewards}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, rewards: checked })}
                    data-testid="switch-rewards"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button data-testid="button-save-notifications">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your data and privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Public Profile</div>
                    <div className="text-sm text-muted-foreground">Make your profile visible to other users</div>
                  </div>
                  <Switch defaultChecked data-testid="switch-public-profile" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Show Earnings</div>
                    <div className="text-sm text-muted-foreground">Display your earnings on your public profile</div>
                  </div>
                  <Switch data-testid="switch-show-earnings" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Activity Feed</div>
                    <div className="text-sm text-muted-foreground">Show your activity in the global feed</div>
                  </div>
                  <Switch defaultChecked data-testid="switch-activity-feed" />
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-4">Data & Account</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-export-data">
                      Export My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-destructive" data-testid="button-delete-account">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
