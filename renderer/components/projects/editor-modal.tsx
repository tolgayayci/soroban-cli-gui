import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import {
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
} from "components/ui/dialog";
import { RadioGroup } from "components/ui/radio-group";
import { CodeIcon } from "lucide-react";
import { useToast } from "components/ui/use-toast";

export default function EditorModal({
  showEditorDialog,
  setShowEditorDialog,
  projectName,
  projectPath,
}: {
  showEditorDialog: boolean;
  setShowEditorDialog: (value: boolean) => void;
  projectName: string;
  projectPath: string;
}) {
  const [availableEditors, setAvailableEditors] = useState([]);
  const [selectedEditor, setSelectedEditor] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const checkAvailableEditors = async () => {
      try {
        const editors = await window.sorobanApi.checkEditors();
        setAvailableEditors(editors);
      } catch (error) {
        console.error("Error checking available editors:", error);
      }
    };
    checkAvailableEditors();
  }, []);

  const handleOpenProject = async () => {
    const editor = availableEditors.find(
      (editor) => editor.name === selectedEditor
    );
    if (editor) {
      try {
        await window.sorobanApi.openEditor(projectPath, editor);
        setShowEditorDialog(false);
        toast({
          title: "Editor opened",
          description: `The project has been opened in ${editor.name}.`,
        });
      } catch (error) {
        console.error("Error opening project:", error);
        toast({
          variant: "destructive",
          title: "Error opening editor",
          description:
            "Please make sure you have the selected editor installed.",
        });
      }
    }
  };

  const handleClose = () => {
    setShowEditorDialog(false);
  };

  return (
    <Dialog open={showEditorDialog} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Open "{projectName}"</DialogTitle>
          <DialogDescription className="pt-2">
            Choose your preferred code editor. Only editors that are installed
            on your system are shown.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <RadioGroup
            aria-label="Editor"
            className="grid gap-2"
            value={selectedEditor}
            onValueChange={setSelectedEditor}
          >
            {availableEditors.map((editor) => (
              <div
                key={editor.name}
                className={`flex items-center gap-4 cursor-pointer rounded-md border px-4 py-3 transition-colors ${
                  selectedEditor === editor.name
                    ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/10"
                    : "border-gray-200 hover:border-gray-900 dark:border-gray-800 dark:hover:border-gray-50"
                }`}
                onClick={() => setSelectedEditor(editor.name)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0077b6] text-white">
                  <CodeIcon className="h-5 w-5" />
                </div>
                <span className="font-medium">{editor.name}</span>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleOpenProject}>
            Open
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
