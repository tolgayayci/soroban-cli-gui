# Projects in SORA

Projects are the cornerstone of your development workflow in SORA, providing an intuitive interface to manage your Stellar contracts.

::: tip SHOWCASE CLIP
New to SORA? Check out our **Projects** showcase video to see how to create, manage, and develop your Stellar projects in SORA!

<!-- <iframe width="600" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
:::

## Projects Dashboard

This central hub is where all your Stellar projects come together, offering a clear overview and easy access to all your work.

<div class="image-border">

![Projects Dashboard](/public/features/projects/dashboard.png)

</div>

The Projects dashboard is your central hub for managing Soroban projects. Here's what you'll find:

1. **Project List**: Displays all your projects with color-coded icons and project names.
2. **Project Count**: Shows the total number of projects you have.
3. **Search Bar**: Allows you to quickly find specific projects.
4. **Create New Project**: A button to initiate the project creation process.

## Creating a New Project

To create a new project:

1. Click the **"Create New Project"** button in the top right corner.
2. You'll see a modal with two tabs: **"New Project"** and "**Import Existing"**.

<div class="image-border">

![Create New Project](/public/features/projects/create.png)

</div>

Under the **"New Project"** tab:

1. **Project Name**: Enter a name for your new project.
2. **Project Path**: Choose where to save your project.
3. **With Example**: Toggle this to include example contracts. A hello-world contract is included by default.
4. **Example Selection**: If "With Example" is toggled on, you can choose from a variety of example contracts.
5. **Frontend Template**: Optionally specify a frontend template for your project.
6. Click **"Create"** to initialize your project.

::: tip
Including example contracts can be a great way to learn Soroban development best practices!
:::

## Importing an Existing Project

To import an existing project:

1. Click **"Create New Project"** and switch to the **"Import Existing"** tab.

<div class="image-border">

![Import Existing Project](/public/features/projects/import.png)

</div>

2. Enter a **Project Name** for SORA to display.
3. Select the **Project Path** where your existing project is located.
4. Click **"Import"** to add the project to SORA.

::: warning
Make sure the project path you provide is the root directory of your existing Soroban project. SORA will verify if it's a valid Soroban project before importing.
:::

## Opening Projects

You can easily open your projects in your preferred code editor:

1. Click the **"Open With"** button next to a project.
2. A modal will appear showing available editors on your system.

<div class="image-border">

![Open Project](/public/features/projects/open-with-editor.png)

</div>

3. **Select** your **preferred editor** from the list of supported editors.
4. Click **"Open"** to launch the project in the chosen editor.

::: info
SORA detects installed editors on your system automatically. The following editors are supported:

- Visual Studio Code
- Visual Studio Code Insiders
- WebStorm
- CLion
- Cursor

Make sure your preferred editor is installed for it to appear in the list.
:::

::: tip
If you don't see your preferred editor in the list, it might not be installed in a standard location. You can open an issue on our [GitHub repository](https://github.com/tolgayayci/sora/issues) to request it to be added.
:::

## Project Management

Each project in the list offers quick actions:

- **Open With**: Opens the project in your chosen code editor.
- **Contracts**: Provides quick access to manage contracts within the project.
- **Delete**: Removes the project from SORA **(doesn't delete files from your system)**.

::: warning
While **SORA doesn't remove files from your system**, it will remove the project from the dashboard.
:::

## Tips for Efficient Use

To make the most of the Projects dashboard:

1. **Use the Search Bar**: When you have multiple projects, use the search functionality to quickly find what you need.
2. **Regular Cleanup**: Remove projects you're no longer working on to keep your dashboard tidy.
3. **Naming Conventions**: Use clear, descriptive names for your projects to make them easy to identify.
4. **Explore Examples**: When creating a new project, consider using different example contracts to learn various Soroban features.

## Behind the Scenes

While SORA provides a user-friendly interface, it's powered by Stellar's CLI tools. The app handles the complex command-line operations for you, making Soroban development more accessible.

For those interested in the underlying processes, SORA utilizes commands similar to `stellar contract init` when creating new projects, but you don't need to worry about the command-line syntax - SORA takes care of it all for you.

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>