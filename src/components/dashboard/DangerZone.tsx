"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Loader2, 
  AlertTriangle, 
  Trash2, 
  Download,
  RefreshCw,
  Shield
} from 'lucide-react';

export function DangerZone() {
  const t = useTranslations('dashboard.dangerZone');
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleExportData = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/account/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `account-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(t('export.success'));
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error('Data export error:', error);
      toast.error(t('export.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm(t('clearHistory.confirmMessage'))) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteAll: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to clear history');
      }

      toast.success(t('clearHistory.success'));
    } catch (error) {
      console.error('Clear history error:', error);
      toast.error(t('clearHistory.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = async () => {
    if (!confirm(t('resetSettings.confirmMessage'))) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/account/reset-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reset settings');
      }

      toast.success(t('resetSettings.success'));
      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Reset settings error:', error);
      toast.error(t('resetSettings.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      toast.error(t('deleteAccount.confirmationError'));
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmation: confirmationText }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      toast.success(t('deleteAccount.success'));
      
      // Sign out and redirect
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error(t('deleteAccount.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          {t('title')}
        </CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Data */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">{t('export.title')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('export.description')}
            </p>
          </div>
          
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {t('export.button')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('export.dialog.title')}</DialogTitle>
                <DialogDescription>
                  {t('export.dialog.description')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <h5 className="font-medium mb-2">{t('export.dialog.includes')}</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t('export.dialog.profileData')}</li>
                    <li>• {t('export.dialog.calculationHistory')}</li>
                    <li>• {t('export.dialog.savedCalculations')}</li>
                    <li>• {t('export.dialog.preferences')}</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  {t('export.dialog.cancel')}
                </Button>
                <Button onClick={handleExportData} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {t('export.dialog.confirm')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Separator />

        {/* Clear History */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">{t('clearHistory.title')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('clearHistory.description')}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleClearHistory}
            disabled={isLoading}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t('clearHistory.button')}
          </Button>
        </div>

        <Separator />

        {/* Reset Settings */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">{t('resetSettings.title')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('resetSettings.description')}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            disabled={isLoading}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('resetSettings.button')}
          </Button>
        </div>

        <Separator />

        {/* Delete Account */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-destructive">{t('deleteAccount.title')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('deleteAccount.description')}
            </p>
          </div>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                {t('deleteAccount.button')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-destructive">
                  {t('deleteAccount.dialog.title')}
                </DialogTitle>
                <DialogDescription>
                  {t('deleteAccount.dialog.description')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <h5 className="font-medium text-destructive">
                        {t('deleteAccount.dialog.warning')}
                      </h5>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• {t('deleteAccount.dialog.consequences.data')}</li>
                        <li>• {t('deleteAccount.dialog.consequences.history')}</li>
                        <li>• {t('deleteAccount.dialog.consequences.irreversible')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmation">
                    {t('deleteAccount.dialog.confirmationLabel')}
                  </Label>
                  <Input
                    id="confirmation"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="DELETE"
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('deleteAccount.dialog.confirmationHint')}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setConfirmationText('');
                  }}
                >
                  {t('deleteAccount.dialog.cancel')}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={confirmationText !== 'DELETE' || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  {t('deleteAccount.dialog.confirm')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
