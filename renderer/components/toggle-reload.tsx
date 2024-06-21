"use client";

import * as React from "react";

import { Button } from "components/ui/button";
import { Icons } from "components/icons";

export function ReloadToggle() {
  async function reloadApplication() {
    try {
      await window.sorobanApi.reloadApplication();
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={() => reloadApplication()}>
      <Icons.reload className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 h-7" />
      <Icons.reload className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 h-7" />{" "}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
