
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoggingOut: boolean
}

export const LogoutDialog = ({ open, onOpenChange, onConfirm, isLoggingOut }: LogoutDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
          <AlertDialogDescription>Apakah Anda yakin ingin keluar dari akun Anda?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoggingOut} className="bg-red-600 hover:bg-red-700">
            {isLoggingOut ? (
              <>
                <span className="mr-2">⏳</span>
                Keluar...
              </>
            ) : (
              "Ya, Keluar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
