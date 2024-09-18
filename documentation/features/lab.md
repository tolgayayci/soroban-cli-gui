# Lab in SORA

The Lab feature in SORA provides a powerful interface for working with Stellar's XDR (External Data Representation) format. It allows you to encode, decode, and manipulate XDR data, which is crucial for advanced Stellar development.

::: tip SHOWCASE CLIP
New to SORA? Check out our **Lab** showcase clip to see how to work with XDR data in SORA!

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
:::

## XDR Commands

The Lab feature supports various XDR-related commands:

1. **Decode**: Convert XDR to JSON format.
2. **Encode**: Convert JSON to XDR format.
3. **Guess**: Attempt to determine the XDR type of given data.
4. **Valid**: Check if given XDR data is valid.
5. **Types List**: List of all XDR types.
   
<div class="image-border">

![Lab Dashboard](/public/features/lab/dashboard.png)

</div>

To use these commands:

1. Select the desired command from the dropdown menu.
2. Fill in the required arguments and options.
3. Click "Run Command" to execute.

## Command Output

After executing any Lab command, SORA provides detailed output:
<div class="image-border">

![Command Output](/public/features/lab/output.png)

</div>

The output is color-coded and structured to provide clear information about the execution results.

## Best Practices

1. **Data Validation**: Always use the "valid" command to check your XDR data before encoding or decoding.
2. **Type Checking**: When unsure about the XDR type, use the "guess" command before attempting to decode.
3. **Error Handling**: Pay attention to error messages in the command output. They often provide valuable information for troubleshooting.
4. **Regular Updates**: Keep your SORA installation up to date to ensure you have the latest XDR capabilities.

## Behind the Scenes

While SORA provides a user-friendly interface for XDR operations, it's powered by Soroban's CLI tools under the hood. The app handles the complex command-line operations for you, making XDR manipulation more accessible.

When you use the Lab feature in SORA, the application is constructing and executing Soroban CLI commands. For example:

- `stellar lab xdr decode`: Decodes XDR data to JSON format.
- `stellar lab xdr encode`: Encodes JSON data to XDR format.
- `stellar lab xdr guess`: Attempts to determine the XDR type of given data.
- `stellar lab xdr valid`: Checks if given XDR data is valid.
- `stellar lab xdr types list`: List of all XDR types.

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>
