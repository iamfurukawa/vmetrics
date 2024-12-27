"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export interface ConfirmActionProps {
  isOpened: boolean;
  setOpened: Function;
  confirmAction: Function;
}

export function AlertConfirmAction({
  isOpened,
  setOpened,
  confirmAction,
}: ConfirmActionProps) {
  return (
    <AlertDialog open={isOpened} onOpenChange={setOpened}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your worklog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => confirmAction(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => confirmAction(true)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
