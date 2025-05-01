import * as LucideIcons from "lucide-react";

// Create a type-safe icon map with all Lucide icons
const iconMap = { ...LucideIcons } as unknown as Record<string, React.FC<any>>;

export default iconMap;