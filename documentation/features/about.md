# About SORA

The About page in SORA provides essential information about your installation, including version details and quick links to important resources. This page is crucial for understanding your current setup and accessing support channels.

::: tip SHOWCASE CLIP
New to SORA? Watch our comprehensive demo video to get started quickly!

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
:::

## Version Information

The About page displays detailed version information for various components of your SORA installation:

<div class="image-border">

![Version Information](/public/features/about/about.png)

</div>

1. **SORA App Version**: The current version of the SORA application.
2. **Stellar/Soroban Version**: The version of the Stellar or Soroban CLI installed on your system.
3. **Soroban-Env Version**: The version of the Soroban environment.
4. **Soroban-Env Interface Version**: The interface version of the Soroban environment.
5. **Stellar-XDR Version**: The version of the Stellar XDR (External Data Representation) library.
6. **XDR Curr Version**: The current version of the XDR implementation.

This information is crucial for troubleshooting, ensuring compatibility, and staying up-to-date with the latest features and improvements.

## Quick Actions

The About page also provides quick access to important actions and resources:

<!-- ![Quick Actions](/public/features/about/quick-actions.png) -->

### Make a Feature Request

If you have ideas for improving SORA:

1. Click the **"Visit Github"** button under "Make a Feature Request".
2. You'll be directed to the GitHub issue creation page with a pre-filled template for feature requests.
3. Fill in the details of your feature request and submit it to the SORA team.

### Report a Bug

If you encounter any issues while using SORA:

1. Click the **"Visit Github"** button under "Report a Bug".
2. You'll be taken to the GitHub issue creation page with a pre-filled bug report template.
3. Provide detailed information about the bug you've encountered and submit the report.

### Review Release Notes

To stay informed about the latest changes and improvements:

1. Click the **"Visit Github"** button under "Review Release Notes".
2. You'll be directed to the GitHub release page for your current SORA version.
3. Here you can review all the changes, new features, and bug fixes included in your version.

## Best Practices

To make the most of the About page:

1. **Regular Checks**: Periodically review the version information to ensure you're using the latest version of SORA and its components.
2. **Before Reporting Issues**: Always check your version information when reporting bugs or requesting support to help the team provide accurate assistance.
3. **Stay Informed**: Regularly review the release notes to stay up-to-date with new features and improvements.
4. **Community Engagement**: Use the feature request and bug report links to actively contribute to SORA's development and improvement.

## Behind the Scenes

The About page in SORA leverages various system calls and API endpoints to gather and display this information:

- Version information is fetched from your local **Soroban** and **Stellar** installations.
- The SORA app version is retrieved from the **application's internal version** tracking.
- **Links to GitHub** are **dynamically generated** based on your current version and the type of action (feature request, bug report, or release notes).

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>
