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

interface SorobanInstallationProps {
  installationInfo: {
    installed: boolean;
    type: string | null;
    version: string | null;
    error?: string;
  };
}

export default function SorobanInstallationAlert({
  installationInfo,
}: SorobanInstallationProps) {
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

  const title = installationInfo.installed
    ? `${installationInfo.type} is installed!`
    : "Soroban/Stellar is not installed!";

  const description = installationInfo.installed
    ? `You have ${installationInfo.type} version ${installationInfo.version} installed.`
    : "You need to install Soroban or Stellar to use this application. Please visit the repository for more information.";

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
            {installationInfo.error && (
              <p className="text-red-500 mt-2">
                Error: {installationInfo.error}
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => reloadApplication()}>
            Reload Application
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              openExternalLink("https://github.com/tolgayayci/soroban-cli-gui")
            }
          >
            Visit GitHub
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
