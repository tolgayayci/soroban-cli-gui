# Logs in SORA

The Logs feature in SORA provides a comprehensive view of your development activities, allowing you to track command history and application logs. This powerful tool enhances your ability to debug, audit, and understand the operations performed within SORA.

::: tip SHOWCASE CLIP
New to SORA? Watch our comprehensive demo video to get started quickly with the Logs feature!

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
:::

## Logs Dashboard

The Logs Dashboard is your central hub for viewing and managing logs in SORA.

<div className="image-border">

![Logs Dashboard](/public/features/logs/command.png)

</div>

Key components of the Logs Dashboard include:

1. **Command History**: A tab displaying the history of commands executed in SORA.
2. **Application Logs**: A tab showing detailed logs of SORA's operations.

## Command History

The Command History tab provides a chronological list of commands executed within SORA, offering powerful features for reviewing and reusing past commands.


<div className="image-border">

![Command History](/public/features/logs/app.png)

</div>
Key features of the Command History:

1. **Timestamp**: Shows when each command was executed, helping you track your development timeline.

2. **Command**: Displays the full command that was run, including all arguments and options.

3. **Status**: Indicates whether the command was successful (green checkmark) or encountered an error (red X).

4. **Details**: Allows you to view more information about the command execution, including full output and any error messages.

5. **Copy Command**: A quick-copy button next to each command lets you instantly copy the command to your clipboard, ready for reuse or modification.

6. **Run Again**: With a single click, you can re-execute any previous command, streamlining repetitive tasks or helping you quickly retry operations with slight modifications.

7. **Filter and Search**: Easily find specific commands using the search bar, which filters commands in real-time as you type.

8. **Sort Options**: Sort your command history by timestamp, command type, or status to quickly locate specific operations.

### Using Command History Effectively

1. **Quick Command Reuse**:
   - To rerun a command, simply click the "Run" button next to the desired command.
   - This feature is particularly useful for repeating test operations or quickly switching between different contract interactions.

2. **Command Modification**:
   - Use the copy feature to quickly grab a previous command.
   - Paste it into your preferred text editor or directly into SORA's command input area.
   - Make any necessary modifications before running the command again.

3. **Troubleshooting**:
   - When encountering errors, use the "Details" view to see the full command output and error messages.
   - Compare successful and failed commands to identify potential issues in your inputs or contract state.

4. **Learning and Optimization**:
   - Review your command history to understand your development patterns.
   - Identify frequently used commands that might benefit from creating shortcuts or scripts.

5. **Collaboration and Support**:
   - Easily share your exact commands with team members or support staff by copying them directly from the history.
   - Include timestamps to provide context for when specific operations were performed.

::: tip
Combine the Command History with SORA's AI-powered Command Generator for even more powerful workflows. Use the history to understand your common patterns, then ask the AI to help you optimize or expand on these commands.
:::

::: warning
Remember that the Command History may contain sensitive information, such as contract addresses or transaction details. Be cautious when sharing or screenshotting this section.
:::

## Application Logs

The Application Logs tab offers a detailed view of SORA's internal operations.

<!-- ![Application Logs](/public/features/logs/application-logs.png) -->

Key features of the Application Logs:

1. **Timestamp**: Indicates when each log entry was recorded.
2. **Log Level**: Shows the severity or type of log (e.g., INFO, WARNING, ERROR).
3. **Message**: Provides the detailed log message.
4. **Component**: Identifies which part of SORA generated the log.

::: warning
Application Logs may contain sensitive information. Be cautious when sharing these logs and ensure you redact any private data.
:::

## Using Logs for Troubleshooting

The Logs feature is an invaluable tool for troubleshooting issues in SORA:

1. **Command Errors**: If a command fails, check the Command History for the exact command used and any error messages.
2. **Application Issues**: Review the Application Logs for warnings or errors that might indicate the root cause of a problem.
3. **Performance Analysis**: Use logs to identify slow operations or frequent errors that might impact performance.

## Best Practices

To make the most of the Logs feature:

1. **Regular Review**: Periodically check your logs to catch potential issues early.
2. **Error Investigation**: When encountering an error, always consult the logs for more context.
3. **Log Retention**: Be aware of how long logs are retained and export important logs if needed.
4. **Privacy Awareness**: Remember that logs may contain sensitive information. Be cautious when sharing.

## Behind the Scenes

The Logs feature in SORA leverages various logging mechanisms to provide you with comprehensive information:

- **Command History**: SORA keeps track of CLI commands executed through its interface, storing them along with their outcomes.
- **Application Logs**: These are generated by SORA's internal processes, capturing everything from routine operations to error conditions.

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>
