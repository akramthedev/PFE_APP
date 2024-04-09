function formatCreatedAt(createdAt) {
  const now = new Date();
  const date = new Date(createdAt);

  // Calculate the difference in time between now and the createdAt date
  const timeDiff = now.getTime() - date.getTime();

  // Convert time difference from milliseconds to days
  const diffDays = timeDiff / (1000 * 3600 * 24);

  if (diffDays > 1) {
    // If createdAt is more than 1 day old, show Day/Month
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed
    return `${day}/${month}`;
  } else {
    // If createdAt is less than 1 day old, show Hour:Minute
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

export default formatCreatedAt;
