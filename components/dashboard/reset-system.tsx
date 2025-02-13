"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSystemReset } from "@/lib/hooks/use-system-reset"
import { RefreshCw, Check, X } from "lucide-react"

export function ResetSystem() {
  const { performReset, isResetting, lastResetStatus } = useSystemReset()

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Reset</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={performReset} 
            disabled={isResetting}
            className="w-full"
          >
            {isResetting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isResetting ? 'Resetting System...' : 'Reset System'}
          </Button>

          {lastResetStatus && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Last Reset Status:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>Ideas:</span>
                  {lastResetStatus.details.ideas ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>Activities:</span>
                  {lastResetStatus.details.activities ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>Achievements:</span>
                  {lastResetStatus.details.achievements ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>Metrics:</span>
                  {lastResetStatus.details.metrics ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Reset performed at: {new Date(lastResetStatus.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}