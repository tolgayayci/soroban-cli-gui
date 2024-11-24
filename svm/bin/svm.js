#!/usr/bin/env node
import { program } from "commander";
import {
  install,
  use,
  current,
  uninstall,
  list,
  selfRemove,
  info,
} from "../lib/commands.js";

program
  .name("svm")
  .description("Stellar Version Manager - manage multiple stellar-cli versions")
  .version("0.1.0");

program
  .command("list")
  .description("List installed versions of stellar-cli")
  .action(list);

program
  .command("install [version]")
  .description("Install a specific version of stellar-cli")
  .action(install);

program
  .command("use [version]")
  .description("Switch to a specific version of stellar-cli")
  .action(use);

program
  .command("current")
  .description("Show current active stellar-cli version")
  .action(current);

program
  .command("uninstall [version]")
  .description("Uninstall a specific version of stellar-cli")
  .action(uninstall);

program
  .command("info")
  .description("Show detailed information about SVM installations and paths")
  .action(info);

program
  .command("self-remove")
  .description("Remove SVM and all its installed versions")
  .action(selfRemove);

program.parse();
