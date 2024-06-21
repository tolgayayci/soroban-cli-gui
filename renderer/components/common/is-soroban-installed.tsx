import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "components/ui/alert-dialog";

export default function SorobanNotInstalled() {
  async function openExternalLink(url: string) {
    try {
      await window.sorobanApi.openExternalLink(url);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  async function reloadApplication() {
    try {
      await window.sorobanApi.reloadApplication();
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Soroban is not installed!</AlertDialogTitle>
          <AlertDialogDescription>
            You need to install Soroban to use this application. Please visit
            the repository for more information.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => reloadApplication() as any}>
            Reload Application
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              openExternalLink(
                "https://github.com/tolgayayci/soroban-cli-gui"
              ) as any
            }
          >
            Visit GitHub
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
