
export function formatDateTime(date) {
  const d = new Date(date);
  const dateStr = d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
  });
  return `${dateStr}`;
}


// export function formatDateTime(date) {
//   const d = new Date(date);
//   const time = d.toLocaleTimeString('en-US', { 
//     hour: '2-digit', 
//     minute: '2-digit',
//     hour12: true 
//   });
//   const dateStr = d.toLocaleDateString('en-US', { 
//     month: 'long', 
//     day: 'numeric', 
//     year: 'numeric' 
//   });
//   return `${dateStr} [${time}]`;
// }

