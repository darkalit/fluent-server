const allRoles = {
  user: ["getWords", "getTests", "getThemes"],
  admin: [
    "getUsers",
    "manageUsers",
    "getWords",
    "manageWords",
    "getTests",
    "manageTests",
    "getThemes",
    "manageThemes",
    "getStats",
    "manageStats",
  ],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(
  Object.entries(allRoles),
);
