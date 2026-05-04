import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ date, onDateChange, placeholder = "Sélectionner une date", className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy", { locale: fr }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          locale={fr}
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  className?: string;
}

export function DateRangePicker({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  className 
}: DateRangePickerProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Date de début</label>
        <DatePicker 
          date={startDate} 
          onDateChange={onStartDateChange}
          placeholder="Début"
        />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Date de fin</label>
        <DatePicker 
          date={endDate} 
          onDateChange={onEndDateChange}
          placeholder="Fin"
        />
      </div>
    </div>
  );
}
