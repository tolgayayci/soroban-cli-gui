# Lab in SORA

The Lab feature in SORA provides a powerful interface for working with Stellar's XDR (External Data Representation) format. It allows you to encode, decode, and manipulate XDR data, which is crucial for advanced Soroban and Stellar development.

::: tip
New to SORA? Watch our comprehensive demo video to get started quickly with the Lab feature!

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
:::

## Lab Dashboard

The Lab Dashboard is your command center for XDR operations in SORA.

<!-- ![Lab Dashboard](/public/features/lab/dashboard.png) -->

Key components of the Lab Dashboard include:

1. **Command Display**: Shows the current Soroban CLI command being constructed based on your selections and inputs.
2. **Command Options**: Interface to select and configure XDR command options.
3. **View Output**: Button to view the full command output in a modal.
4. **View Command History**: Button to access the logs of previous commands.

## XDR Commands

The Lab feature supports various XDR-related commands:

1. **Decode**: Convert XDR to JSON format.
2. **Encode**: Convert JSON to XDR format.
3. **Guess**: Attempt to determine the XDR type of given data.
4. **Valid**: Check if given XDR data is valid.

To use these commands:

1. Select the desired command from the dropdown menu.
2. Fill in the required arguments and options.
3. Click "Run Command" to execute.

## Command Output

After executing any Lab command, SORA provides detailed output:

<!-- ![Command Output](/public/features/lab/command-output.png) -->

The output is color-coded and structured to provide clear information about the execution results, including:

- Success Messages (Green)
- Errors (Red)
- XDR Data
- JSON Representations

You can view this output directly in the SORA interface or copy it for further analysis.

## Command History

To view your command history:

1. Click the "View Command History" button.
2. This will take you to the Logs page, where you can review all previously executed Lab commands.

## Best Practices

1. **Data Validation**: Always use the "valid" command to check your XDR data before encoding or decoding.
2. **Type Checking**: When unsure about the XDR type, use the "guess" command before attempting to decode.
3. **Error Handling**: Pay attention to error messages in the command output. They often provide valuable information for troubleshooting.
4. **Regular Updates**: Keep your SORA installation up to date to ensure you have the latest XDR capabilities.

## Behind the Scenes

While SORA provides a user-friendly interface for XDR operations, it's powered by Soroban's CLI tools under the hood. The app handles the complex command-line operations for you, making XDR manipulation more accessible.

When you use the Lab feature in SORA, the application is constructing and executing Soroban CLI commands. For example:

- `soroban lab xdr decode`: Decodes XDR data to JSON format.
- `soroban lab xdr encode`: Encodes JSON data to XDR format.
- `soroban lab xdr guess`: Attempts to determine the XDR type of given data.
- `soroban lab xdr valid`: Checks if given XDR data is valid.

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>
