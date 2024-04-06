function formatCreatedAt(createdAt) {
    const date = new Date(createdAt);
  
    // Format hours and minutes
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    // Format day, month, and year
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed
    const year = date.getFullYear();
  
    return `${hours}:${minutes} • ${day}/${month}/${year}`;
  }



export default formatCreatedAt;