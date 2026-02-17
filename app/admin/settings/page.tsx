"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, CreditCard, Shield, Globe } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your platform settings and preferences</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Platform Settings
            </CardTitle>
            <CardDescription>General platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" defaultValue="EMMA STUDIOS" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" defaultValue="support@emmastudios.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Default Timezone</Label>
              <Input id="timezone" defaultValue="America/Los_Angeles" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">Temporarily disable public access</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New User Registration</p>
                <p className="text-sm text-muted-foreground">Allow new creators to sign up</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Button className="bg-accent hover:bg-accent/90">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure email and push notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Booking Notifications</p>
                <p className="text-sm text-muted-foreground">Email when a new booking is created</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Booking Reminders</p>
                <p className="text-sm text-muted-foreground">Send reminders 24 hours before bookings</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Notifications</p>
                <p className="text-sm text-muted-foreground">Email confirmations for payments</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Review Requests</p>
                <p className="text-sm text-muted-foreground">Ask clients for reviews after bookings</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Button className="bg-accent hover:bg-accent/90">Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
            <CardDescription>Configure payment processing and fees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Payment Gateway</Label>
              <Input defaultValue="Stripe" disabled />
              <p className="text-xs text-muted-foreground">Connected and active</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platformFee">Platform Fee (%)</Label>
              <Input id="platformFee" type="number" defaultValue="15" min="0" max="100" step="0.1" />
              <p className="text-xs text-muted-foreground">Percentage taken from each booking</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Deposits</p>
                <p className="text-sm text-muted-foreground">Require partial payment upfront</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Button className="bg-accent hover:bg-accent/90">Update Payment Settings</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage security and authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent">
                Enable
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-2">Change Password</p>
              <div className="space-y-3">
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password" />
                <Input type="password" placeholder="Confirm new password" />
                <Button variant="outline" className="bg-transparent">
                  Update Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Templates
            </CardTitle>
            <CardDescription>Customize automated email templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Booking Confirmation</p>
                <p className="text-sm text-muted-foreground">Sent when a booking is confirmed</p>
              </div>
              <Button variant="ghost" size="sm" className="bg-transparent">
                Edit
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Booking Reminder</p>
                <p className="text-sm text-muted-foreground">Sent 24 hours before booking</p>
              </div>
              <Button variant="ghost" size="sm" className="bg-transparent">
                Edit
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Payment Receipt</p>
                <p className="text-sm text-muted-foreground">Sent after successful payment</p>
              </div>
              <Button variant="ghost" size="sm" className="bg-transparent">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
