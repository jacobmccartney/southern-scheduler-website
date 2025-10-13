import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface ScheduledCourse {
  crn: string;
  code: string;
  name: string;
  room: string;
  day: number;
  startTime: number;
  duration: number;
  campus: "statesboro" | "armstrong" | "online";
}

interface ExportViewProps {
  schedule: ScheduledCourse[];
  onBack: () => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_ABBREV = ["M", "T", "W", "R", "F"];

const ExportView = ({ schedule, onBack }: ExportViewProps) => {
  const [selectedDay, setSelectedDay] = useState(0);

  // Calculate stats
  const getTimeInMinutes = (startTime: number) => {
    return (Math.floor(startTime / 2) + 8) * 60 + (startTime % 2) * 30;
  };

  const formatTime = (minutes: number) => {
    const hour = Math.floor(minutes / 60);
    const min = minutes % 60;
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${min.toString().padStart(2, "0")} ${ampm}`;
  };

  // Earliest classes
  const earliestTime = Math.min(...schedule.map(c => getTimeInMinutes(c.startTime)));
  const earliestClasses = schedule.filter(c => getTimeInMinutes(c.startTime) === earliestTime);
  
  // Latest classes
  const latestTime = Math.max(...schedule.map(c => getTimeInMinutes(c.startTime) + c.duration * 30));
  const latestClasses = schedule.filter(c => getTimeInMinutes(c.startTime) + c.duration * 30 === latestTime);

  // Longest/Shortest days
  const dayMinutes = [0, 1, 2, 3, 4].map(day => {
    const dayCourses = schedule.filter(c => c.day === day);
    return dayCourses.reduce((total, c) => total + c.duration * 30, 0);
  });
  
  const maxMinutes = Math.max(...dayMinutes);
  const minMinutes = Math.min(...dayMinutes.filter(m => m > 0));
  
  const longestDays = dayMinutes
    .map((mins, idx) => mins === maxMinutes ? idx : -1)
    .filter(idx => idx !== -1);
  
  const shortestDays = dayMinutes
    .map((mins, idx) => mins === minMinutes && mins > 0 ? idx : -1)
    .filter(idx => idx !== -1);

  // Get unique CRNs with course info, sorted alphabetically
  const uniqueCourses = Array.from(new Set(schedule.map(c => c.crn)))
    .map(crn => schedule.find(c => c.crn === crn)!)
    .sort((a, b) => a.code.localeCompare(b.code));

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Schedule
        </Button>

        <h1 className="text-4xl font-bold text-foreground mb-8">Schedule Summary</h1>

        {/* Stats Table */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Schedule Statistics</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Earliest Class(es)</h3>
              <p className="text-lg font-medium">
                {formatTime(earliestTime)} - {earliestClasses.map(c => c.code).join(", ")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Latest Class(es)</h3>
              <p className="text-lg font-medium">
                {formatTime(latestTime)} - {latestClasses.map(c => c.code).join(", ")}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Longest Day(s)</h3>
              <p className="text-lg font-medium">
                {longestDays.map(d => DAYS[d]).join(", ")} ({Math.floor(maxMinutes / 60)}h {maxMinutes % 60}m)
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Shortest Day(s)</h3>
              <p className="text-lg font-medium">
                {shortestDays.length > 0 
                  ? `${shortestDays.map(d => DAYS[d]).join(", ")} (${Math.floor(minMinutes / 60)}h ${minMinutes % 60}m)`
                  : "N/A"
                }
              </p>
            </div>
          </div>
        </Card>

        {/* CRN Table */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-2">Input these CRNs into WINGS!</h2>
          <div className="mt-4 space-y-2">
            {uniqueCourses.map(course => (
              <div 
                key={course.crn}
                className="flex items-center justify-between p-3 bg-sidebar-accent rounded-lg border border-sidebar-border"
              >
                <div>
                  <span className="font-semibold text-sm">{course.code}</span>
                  <span className="text-sm text-muted-foreground ml-2">{course.name}</span>
                </div>
                <span 
                  className="font-mono font-bold text-sm"
                  style={{ 
                    color: course.campus === 'statesboro' ? '#8800FF' : 
                           course.campus === 'armstrong' ? '#FF00F6' : 
                           '#0900FF' 
                  }}
                >
                  {course.crn}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Map Placeholder */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Walking Route Between Classes</h2>
          
          {/* Day selector */}
          <div className="flex gap-2 mb-4">
            {DAY_ABBREV.map((day, idx) => (
              <Button
                key={day}
                variant={selectedDay === idx ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDay(idx)}
                className="transition-all"
              >
                {day}
              </Button>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center">
              <p className="text-lg font-semibold text-muted-foreground">Map Placeholder</p>
              <p className="text-sm text-muted-foreground mt-2">
                Walking route for {DAYS[selectedDay]}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExportView;
