# Events in SORA

Events are a crucial part of the Soroban development workflow in SORA. They allow you to monitor and interact with contract events on the Stellar network, providing valuable insights into your smart contract operations.

::: tip SHOWCASE CLIP
New to SORA? Watch our comprehensive demo video to get started quickly with managing events!

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
:::

## Events Dashboard

The Events Dashboard is your central hub for managing all contract events across your Soroban projects in SORA.

<div class="image-border">

![Events Dashboard](/public/features/events/dashboard.png)

</div>

Key features of the Events Dashboard include:

1. **Event List**: Displays all your contract events with details such as Start Ledger, Event Type, Network, and RPC URL.
2. **Search Bar**: Allows you to quickly find specific events across all your projects.
3. **Add New Event**: A button to initiate the event creation process.
4. **Pagination**: Navigate through your events if you have more than fit on one page.
5. **Rows per Page**: Adjust the number of events displayed per page.

## Adding a New Event

To add a new contract event:

1. Click the **"Add New Event"** button in the top right corner.
2. A modal will appear with fields to configure your new event.

<div class="image-border">

![Add New Event](/public/features/events/add.png)

</div>

Fill in the following details:

1. **Start Ledger**: The first ledger sequence number in the range to pull events.
2. **Network Passphrase**: The network passphrase to sign the transaction sent to the RPC server.
3. **Network**: Name of the network to use from the config.
4. **RPC URL**: The RPC server endpoint.
5. **Cursor**: (Optional) The cursor corresponding to the start of the event range.
6. **Count**: (Optional) The maximum number of events to display.

Additional options are available under the "Filters" and "Testing Options" sections.

## Event Details

To view details of a specific event:

1. Click the **"Event Detail"** button next to an event in the list.
2. You'll be taken to a detailed view of the event.

<!-- ![Event Details](/public/features/events/event-details.png) -->

The Event Details page shows:

1. **Event Information**: Start Ledger and RPC URL of the event.
2. **Edit Event**: Button to modify the event configuration.
3. **Remove Event**: Button to delete the event.
4. **Event Output**: Displays the output of the Soroban CLI `events` command for this event.

## Editing an Event

To edit an existing event:

1. Navigate to the Event Details page.
2. Click the **"Edit Event"** button.
3. Modify the desired fields in the edit modal.
4. Click "Update Contract Event" to save your changes.

<div class="image-border">

![Edit Event](/public/features/events/edit.png)

</div>

::: warning
Changing key fields like RPC URL or Start Ledger will cause the application to reload.
:::

## Removing an Event

To remove an event from SORA:

1. Navigate to the Event Details page.
2. Click the **"Remove"** button.
3. Confirm the removal in the dialog that appears.

<div class="image-border">

![Remove Event](/public/features/events/remove.png)

</div>

::: danger IMPORTANT
Be cautious when removing events. This action cannot be undone.
:::

## Best Practices

1. **Use Descriptive Names**: When adding events, use clear and descriptive names to easily identify them later.
2. **Regular Cleanup**: Remove events that are no longer needed to keep your dashboard organized.
3. **Use Filters**: Utilize the filtering options to focus on specific contract events when debugging or monitoring.
4. **Monitor Performance**: Keep an eye on the number of events you're tracking, as a large number may impact performance.

## Behind the Scenes

SORA uses the Soroban CLI's `events` command to manage and display contract events. Here are some of the key operations performed:

- `stellar events`: Fetch events from the network
- `stellar events --start-ledger`: Retrieve events starting from a specific ledger
- `stellar events --contract-id`: Filter events by contract ID
- `stellar events --count`: Limit the number of events returned
- `stellar events --cursor`: Start fetching events from a specific cursor position
- `stellar events --event-type`: Filter events by type (e.g., 'contract', 'system', or 'all')

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>
