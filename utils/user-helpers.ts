export function getInitials(fullName: string) {
  const nameParts = fullName.split(" ");
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
  const lastNameInitial = nameParts[nameParts.length - 1]
    .charAt(0)
    .toUpperCase();
  return `${firstNameInitial}${lastNameInitial}`;
}
