// Projects Notifications
export const projectCreateSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been created successfully.`,
});

export const projectCreateError = (contentName: string, error: string) => ({
  title: "Error",
  description: `Failed to create ${contentName}. ${error}`,
});

export const projectImportSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been imported successfully.`,
});

export const projectImportError = (contentName: string) => ({
  title: "Error",
  description: `Failed to import ${contentName}. Make sure you selected folder that containing Cargo.toml and includes soroban-sdk dependency!`,
});

export const projectRenameSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been renamed successfully.`,
});

export const projectRenameError = (contentName: string) => ({
  title: "Error",
  description: `Failed to rename ${contentName}.`,
});

export const projectRemoveSuccess = (contentName: string) => ({
  title: "Success",
  description: `${contentName} has been removed successfully.`,
});

export const projectRemoveError = (contentName: string, error: string) => ({
  title: "Error",
  description: `Failed to remove ${contentName}. ${error}`,
});

// Identities Notifications (OK)
export const identityCreateSuccess = (contentName: string) => ({
  title: "Successfully Created",
  description: `${contentName} identity has been created successfully.`,
});

export const identityCreateError = (contentName: string, error: string) => ({
  title: "Identity Create Error",
  description: `Failed to create identity ${contentName}. ${error}`,
});

export const identityAddSuccess = (contentName: string) => ({
  title: "Successfully Added",
  description: `${contentName} has been imported successfully.`,
});

export const identityAddError = (contentName: string, error: string) => ({
  title: "Identity Add Error",
  description: `Failed to import ${contentName}. ${error}`,
});

export const identityRemoveSuccess = (contentName: string) => ({
  title: "Successfully Removed",
  description: `${contentName} identity has been removed successfully.`,
});

export const identityRemoveError = (contentName: string, error: string) => ({
  title: "Identity Remove Error",
  description: `Failed to remove identity ${contentName}. ${error}`,
});

export const identityFundSuccess = (contentName: string) => ({
  title: "Successfully Funded",
  description: `${contentName} identity has been funded successfully.`,
});

export const identityFundError = (contentName: string, error: string) => ({
  title: "Identity Fund Error",
  description: `Failed to fund identity ${contentName}. ${error}`,
});

// Networks Notifications (OK)
export const networkCreateSuccess = (contentName: string) => ({
  title: "Successfully Created",
  description: `${contentName} network has been created.`,
});

export const networkCreateError = (contentName: string, error: string) => ({
  title: "Network Create Error",
  description: `Failed to create ${contentName} network. ${error}`,
});

export const networkRemoveSuccess = (contentName: string) => ({
  title: "Successfully Removed",
  description: `${contentName} network has been removed successfully.`,
});

export const networkRemoveError = (contentName: string, error: string) => ({
  title: "Network Remove Error",
  description: `Failed to remove ${contentName}. ${error}`,
});
