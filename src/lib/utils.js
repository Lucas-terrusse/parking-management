export function cn(...classes) {
 return classes.filter(Boolean).join(' ');
}

export function formatDate(date) {
 return new Intl.DateTimeFormat('fr-FR', {
   day: 'numeric',
   month: 'long',
   year: 'numeric'
 }).format(new Date(date));
}

export function clsx(...classes) {
 return classes.filter(Boolean).join(' ');
}