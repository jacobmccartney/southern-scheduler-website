import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Clock, User, Trash2, X, AlertCircle, RotateCcw, FileDown } from "lucide-react";
import LoadingScreen from "./LoadingScreen";
import ExportView from "./ExportView";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIME_SLOTS = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = (i % 2) * 30;
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
});

interface CourseSection {
  id: string;
  crn: string;
  time: string;
  days: string;
  instructor: string;
  room: string;
  seats: string;
  campus: "statesboro" | "armstrong" | "online";
}

interface Course {
  id: string;
  code: string;
  name: string;
  sections: CourseSection[];
}

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

const MOCK_COURSES: Course[] = [
  {
    id: "1",
    code: "MATH 1113",
    name: "Precalculus",
    sections: [
      { id: "1-1", crn: "12345", time: "9:00 AM - 9:50 AM", days: "MWF", instructor: "Dr. Smith", room: "Newton Hall 101", seats: "25/30", campus: "statesboro" },
      { id: "1-2", crn: "12346", time: "11:00 AM - 12:15 PM", days: "TR", instructor: "Dr. Johnson", room: "Math Building 205", seats: "18/25", campus: "statesboro" },
      { id: "1-3", crn: "12347", time: "2:00 PM - 3:15 PM", days: "TR", instructor: "Prof. Williams", room: "Armstrong Hall 303", seats: "22/30", campus: "armstrong" },
      { id: "1-4", crn: "12348", time: "Asynchronous", days: "", instructor: "Dr. Anderson", room: "Asynchronous", seats: "35/40", campus: "online" },
    ],
  },
  {
    id: "2",
    code: "CSCI 1301",
    name: "Programming Principles I",
    sections: [
      { id: "2-1", crn: "23456", time: "10:00 AM - 11:15 AM", days: "MW", instructor: "Dr. Garcia", room: "IT Building 120", seats: "20/24", campus: "statesboro" },
      { id: "2-2", crn: "23457", time: "1:00 PM - 2:15 PM", days: "TR", instructor: "Prof. Martinez", room: "Online Sync 202", seats: "30/35", campus: "online" },
      { id: "2-3", crn: "23458", time: "3:30 PM - 4:45 PM", days: "MW", instructor: "Dr. Lee", room: "Science Hall 215", seats: "15/20", campus: "armstrong" },
      { id: "2-4", crn: "23459", time: "Asynchronous", days: "", instructor: "Prof. Chen", room: "Asynchronous", seats: "40/45", campus: "online" },
    ],
  },
  {
    id: "3",
    code: "ENGL 1101",
    name: "Composition I",
    sections: [
      { id: "3-1", crn: "34567", time: "8:00 AM - 9:15 AM", days: "TR", instructor: "Prof. Anderson", room: "Liberal Arts 102", seats: "19/22", campus: "statesboro" },
      { id: "3-2", crn: "34568", time: "12:30 PM - 1:45 PM", days: "MW", instructor: "Dr. Taylor", room: "Online Sync 305", seats: "25/30", campus: "online" },
      { id: "3-3", crn: "34569", time: "5:00 PM - 6:15 PM", days: "TR", instructor: "Prof. Brown", room: "Armstrong Center 401", seats: "16/20", campus: "armstrong" },
    ],
  },
  {
    id: "4",
    code: "BIOL 1107",
    name: "Principles of Biology I",
    sections: [
      { id: "4-1", crn: "45678", time: "9:30 AM - 10:45 AM", days: "MWF", instructor: "Dr. Wilson", room: "Biology Building 150", seats: "28/35", campus: "statesboro" },
      { id: "4-2", crn: "45679", time: "11:00 AM - 12:15 PM", days: "TR", instructor: "Prof. Davis", room: "Science Lab 220", seats: "24/30", campus: "armstrong" },
      { id: "4-3", crn: "45680", time: "2:00 PM - 3:15 PM", days: "MW", instructor: "Dr. Moore", room: "Online Sync 410", seats: "32/40", campus: "online" },
    ],
  },
  {
    id: "5",
    code: "HIST 2111",
    name: "U.S. History I",
    sections: [
      { id: "5-1", crn: "56789", time: "8:00 AM - 9:15 AM", days: "MW", instructor: "Prof. Thompson", room: "Carroll Building 305", seats: "22/28", campus: "statesboro" },
      { id: "5-2", crn: "56790", time: "1:00 PM - 2:15 PM", days: "TR", instructor: "Dr. White", room: "History Hall 201", seats: "20/25", campus: "armstrong" },
      { id: "5-3", crn: "56791", time: "6:00 PM - 7:15 PM", days: "W", instructor: "Prof. Harris", room: "Online Sync 501", seats: "35/40", campus: "online" },
    ],
  },
  {
    id: "6",
    code: "CHEM 1211",
    name: "Chemistry I",
    sections: [
      { id: "6-1", crn: "67890", time: "10:00 AM - 11:15 AM", days: "TR", instructor: "Dr. Clark", room: "Chemistry Building 105", seats: "26/30", campus: "statesboro" },
      { id: "6-2", crn: "67891", time: "12:00 PM - 1:15 PM", days: "MW", instructor: "Prof. Lewis", room: "Science Complex 310", seats: "21/25", campus: "armstrong" },
      { id: "6-3", crn: "67892", time: "3:00 PM - 4:15 PM", days: "TR", instructor: "Dr. Walker", room: "Online Sync 601", seats: "28/35", campus: "online" },
    ],
  },
];

const CourseScheduler = () => {
  const [selectedCampus, setSelectedCampus] = useState<string[]>(["statesboro"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [schedule, setSchedule] = useState<ScheduledCourse[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedCourse, setDraggedCourse] = useState<ScheduledCourse | null>(null);
  const [draggedSection, setDraggedSection] = useState<CourseSection | null>(null);
  const [timeFilters, setTimeFilters] = useState<string[]>([]);
  const [honorsFilter, setHonorsFilter] = useState<"included" | "excluded" | "only">("included");
  const [snapAnimating, setSnapAnimating] = useState<string | null>(null);
  const [gatheringCRN, setGatheringCRN] = useState<string | null>(null);
  const [hoveredCRN, setHoveredCRN] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/snap.mp3");
  }, []);

  const filteredCourses = searchQuery === "" ? [] : MOCK_COURSES.filter(course => {
    const matchesSearch = course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const hasSectionsInCampus = course.sections.some(section => 
      selectedCampus.includes(section.campus)
    );
    
    return matchesSearch && hasSectionsInCampus;
  }).map(course => ({
    ...course,
    sections: course.sections.filter(section => {
      if (!selectedCampus.includes(section.campus)) return false;
      
      // Filter by time preferences
      if (timeFilters.includes("No 8:00 AMs") && section.time.includes("8:00 AM")) return false;
      if (timeFilters.includes("No Evening Classes")) {
        const timeMatch = section.time.match(/(\d+):(\d+)\s*(AM|PM)/);
        if (timeMatch) {
          let hour = parseInt(timeMatch[1]);
          if (timeMatch[3] === "PM" && hour !== 12) hour += 12;
          if (hour >= 17) return false;
        }
      }
      if (timeFilters.includes("No Friday Meetings") && section.days.includes("F")) return false;
      
      return true;
    })
  })).filter(course => course.sections.length > 0);

  const checkOverlap = (section: CourseSection): boolean => {
    const timeMatch = section.time.match(/(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/);
    if (!timeMatch) return false;

    let startHour = parseInt(timeMatch[1]);
    if (timeMatch[3] === "PM" && startHour !== 12) startHour += 12;
    if (timeMatch[3] === "AM" && startHour === 12) startHour = 0;
    const startMinute = parseInt(timeMatch[2]);
    const startTime = startHour * 60 + startMinute;

    let endHour = parseInt(timeMatch[4]);
    if (timeMatch[6] === "PM" && endHour !== 12) endHour += 12;
    if (timeMatch[6] === "AM" && endHour === 12) endHour = 0;
    const endMinute = parseInt(timeMatch[5]);
    const endTime = endHour * 60 + endMinute;

    const dayLetters = section.days.split("");
    const dayMap: { [key: string]: number } = { M: 0, T: 1, W: 2, R: 3, F: 4 };

    return dayLetters.some(letter => {
      const dayIndex = dayMap[letter];
      if (dayIndex === undefined) return false;

      return schedule.some(scheduledCourse => {
        if (scheduledCourse.day !== dayIndex) return false;
        
        const scheduledStart = (Math.floor(scheduledCourse.startTime / 2) + 8) * 60 + (scheduledCourse.startTime % 2) * 30;
        const scheduledEnd = scheduledStart + (scheduledCourse.duration * 30);

        return (startTime < scheduledEnd && endTime > scheduledStart);
      });
    });
  };

  const getCampusGradient = (campus: "statesboro" | "armstrong" | "online") => {
    const gradients = {
      statesboro: "linear-gradient(135deg, #8800FF 0%, #6600CC 100%)",
      armstrong: "linear-gradient(135deg, #FF00F6 0%, #CC00C4 100%)",
      online: "linear-gradient(135deg, #0900FF 0%, #0700CC 100%)",
    };
    return gradients[campus];
  };


  const handleSectionDragStart = (e: React.DragEvent, section: CourseSection, course: Course) => {
    setIsDragging(true);
    setDraggedSection(section);
    
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    dragImage.style.opacity = "1";
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleSectionDragEnd = () => {
    setIsDragging(false);
    setDraggedSection(null);
  };

  const handleCourseDragStart = (course: ScheduledCourse) => {
    setIsDragging(true);
    setDraggedCourse(course);
    setGatheringCRN(course.crn);
  };

  const handleCourseDragEnd = () => {
    setIsDragging(false);
    setDraggedCourse(null);
    setTimeout(() => setGatheringCRN(null), 300);
  };

  const handleDeleteCourse = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedCourse) {
      setSchedule(schedule.filter(c => c.crn !== draggedCourse.crn));
      setDraggedCourse(null);
      setIsDragging(false);
      setTimeout(() => setGatheringCRN(null), 100);
    }
  };

  const handleCalendarDrop = (dayIndex: number, timeIndex: number) => {
    if (!draggedSection) return;

    const course = MOCK_COURSES.find(c => c.sections.some(s => s.id === draggedSection.id));
    if (!course) return;

    const timeMatch = draggedSection.time.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (!timeMatch) return;

    const [_, hourStr, minuteStr, period] = timeMatch;
    let hour = parseInt(hourStr);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    const minute = parseInt(minuteStr);
    
    // Calculate the correct time slot based on actual time
    const correctTimeIndex = ((hour - 8) * 2) + (minute >= 30 ? 1 : 0);

    const durationMatch = draggedSection.time.match(/(\d+):(\d+)\s*-\s*(\d+):(\d+)/);
    let duration = 3;
    if (durationMatch) {
      const startMin = hour * 60 + minute;
      let endHour = parseInt(durationMatch[3]);
      const endMinute = parseInt(durationMatch[4]);
      if (draggedSection.time.includes("PM") && endHour !== 12) endHour += 12;
      const endMin = endHour * 60 + endMinute;
      duration = Math.ceil((endMin - startMin) / 30);
    }

    const dayLetters = draggedSection.days.split("");
    const dayMap: { [key: string]: number } = { M: 0, T: 1, W: 2, R: 3, F: 4 };
    
    const newCourses: ScheduledCourse[] = dayLetters
      .map(letter => dayMap[letter])
      .filter(day => day !== undefined)
      .map(day => ({
        crn: draggedSection.crn,
        code: course.code,
        name: course.name,
        room: draggedSection.room,
        day,
        startTime: correctTimeIndex,
        duration,
        campus: draggedSection.campus,
      }));

    setSchedule([...schedule, ...newCourses]);
    audioRef.current?.play();
    setSnapAnimating(draggedSection.crn);
    setTimeout(() => setSnapAnimating(null), 300);
  };

  const addTimeFilter = (filter: string) => {
    if (!timeFilters.includes(filter)) {
      setTimeFilters([...timeFilters, filter]);
    }
  };

  const removeTimeFilter = (filter: string) => {
    setTimeFilters(timeFilters.filter(f => f !== filter));
  };

  const asyncOnlineCourses = schedule.filter(c => c.campus === "online" && c.room === "Asynchronous");

  const toggleCampus = (campus: string) => {
    if (selectedCampus.includes(campus)) {
      if (selectedCampus.length > 1) {
        setSelectedCampus(selectedCampus.filter(c => c !== campus));
      }
    } else {
      setSelectedCampus([...selectedCampus, campus]);
    }
  };

  const handleReset = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    } else {
      setSchedule([]);
      setResetConfirm(false);
    }
  };

  const handleExport = () => {
    setShowExport(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  if (showExport) {
    return <ExportView schedule={schedule} onBack={() => setShowExport(false)} />;
  }

  return (
    <div className="flex h-screen bg-background dark relative">
      {/* Cosmic background - only behind calendar */}
      <div className="fixed inset-0 pointer-events-none" style={{ left: '16rem' }}>
        <div 
          className="absolute inset-0 animate-pulse"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(136, 0, 255, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(255, 0, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at left, rgba(9, 0, 255, 0.15) 0%, transparent 50%)',
            animationDuration: '8s'
          }}
        />
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.4
            }}
          />
        ))}
      </div>
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6 overflow-y-auto relative z-10">
        <div className="space-y-6">
          {/* Campus Selection */}
          <div>
            <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Select Campus</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedCampus.includes("statesboro") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCampus("statesboro")}
                className="transition-all"
                style={selectedCampus.includes("statesboro") ? {
                  backgroundColor: '#8800FF',
                  borderColor: '#8800FF',
                  color: 'white'
                } : {}}
              >
                Statesboro
              </Button>
              <Button
                variant={selectedCampus.includes("armstrong") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCampus("armstrong")}
                className="transition-all"
                style={selectedCampus.includes("armstrong") ? {
                  backgroundColor: '#FF00F6',
                  borderColor: '#FF00F6',
                  color: 'white'
                } : {}}
              >
                Armstrong
              </Button>
              <Button
                variant={selectedCampus.includes("online") ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCampus("online")}
                className="transition-all col-span-2"
                style={selectedCampus.includes("online") ? {
                  backgroundColor: '#0900FF',
                  borderColor: '#0900FF',
                  color: 'white'
                } : {}}
              >
                Online
              </Button>
            </div>
          </div>

          {/* Search */}
          <div>
            <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Search Courses</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-sidebar-accent border-sidebar-border focus:ring-white focus:border-white text-sidebar-foreground placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Honors Filter */}
          <div>
            <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Honors Sections</h3>
            <Select value={honorsFilter} onValueChange={(value: "included" | "excluded" | "only") => setHonorsFilter(value)}>
              <SelectTrigger className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground focus:ring-white focus:border-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-sidebar-accent border-sidebar-border">
                <SelectItem value="included" className="hover:bg-muted focus:bg-muted">Included</SelectItem>
                <SelectItem value="excluded" className="hover:bg-muted focus:bg-muted">Excluded</SelectItem>
                <SelectItem value="only" className="hover:bg-muted focus:bg-muted">Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filters */}
          <div>
            <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Time Preferences</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {["No 8:00 AMs", "No Evening Classes", "No Friday Meetings"].map((filter) => (
                  <Button
                    key={filter}
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeFilter(filter)}
                    disabled={timeFilters.includes(filter)}
                    className="text-xs bg-sidebar-accent text-sidebar-foreground hover:bg-white hover:text-black disabled:opacity-50 transition-colors"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
              {timeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-sidebar-border">
                  {timeFilters.map((filter) => (
                    <Badge
                      key={filter}
                      className="pr-1 cursor-pointer bg-white text-black hover:bg-white/80 transition-colors"
                      onClick={() => removeTimeFilter(filter)}
                    >
                      {filter}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div>
            <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Results</h3>
            {filteredCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No courses found. Try searching for a course.
              </p>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {filteredCourses.map((course) => (
                  <AccordionItem
                    key={course.id}
                    value={course.id}
                    className="border-none"
                  >
                    <AccordionTrigger className="bg-sidebar-accent hover:bg-sidebar-accent/80 border border-sidebar-border rounded-lg px-3 py-2 hover:no-underline transition-all hover:shadow-md">
                      <div className="text-left">
                        <div className="font-semibold text-sm text-sidebar-foreground">{course.code}</div>
                        <div className="text-xs text-muted-foreground mt-1">{course.name}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-0">
                      <TooltipProvider>
                        <div className="space-y-2 pl-1">
                          {course.sections.map((section) => {
                            const hasOverlap = checkOverlap(section);
                            return (
                              <Card
                                key={section.id}
                                draggable
                                onDragStart={(e) => handleSectionDragStart(e, section, course)}
                                onDragEnd={handleSectionDragEnd}
                                className={`p-3 bg-sidebar-accent/50 hover:bg-sidebar-accent border-sidebar-border cursor-grab active:cursor-grabbing transition-all hover:scale-[1.01] hover:shadow-md relative ${
                                  isDragging && draggedSection?.id === section.id ? "animate-swing opacity-80" : ""
                                }`}
                              >
                                {hasOverlap && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="absolute bottom-2 right-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>This class overlaps with your current schedule</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                                <div className="flex items-center justify-between mb-2">
                                  <span 
                                    className="text-xs font-mono font-semibold"
                                    style={{ 
                                      color: section.campus === 'statesboro' ? '#8800FF' : 
                                             section.campus === 'armstrong' ? '#FF00F6' : 
                                             '#0900FF' 
                                    }}
                                  >
                                    CRN {section.crn}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{section.seats}</span>
                                </div>
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 text-xs">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sidebar-foreground">{section.time}</span>
                                    <span className="text-muted-foreground">({section.days})</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sidebar-foreground">{section.instructor}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">{section.room}</div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </TooltipProvider>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </aside>

      {/* Calendar */}
      <main className="flex-1 overflow-hidden p-6 relative flex flex-col z-10">
        {/* Top controls */}
        <div className="flex justify-between items-center mb-4">
          <Button
            variant={resetConfirm ? "destructive" : "outline"}
            size="sm"
            onClick={handleReset}
            className="transition-all"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {resetConfirm ? "Are you sure?" : "Reset Schedule"}
          </Button>
          
          {schedule.length > 0 && (
            <Button
              onClick={handleExport}
              className="transition-all"
              style={{
                background: 'linear-gradient(135deg, #8800FF 0%, #FF00F6 50%, #0900FF 100%)',
                color: 'white'
              }}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Ready to export?
            </Button>
          )}
        </div>

        {/* Floating Trash Can */}
        <div
          className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${
            isDragging 
              ? 'scale-100 opacity-100 animate-bounce' 
              : 'scale-0 opacity-0 pointer-events-none'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDeleteCourse}
        >
          <div className="bg-white hover:bg-white/90 p-6 rounded-full shadow-2xl cursor-pointer transition-all hover:scale-110">
            <Trash2 className="h-10 w-10 text-gray-600" />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-[60px_repeat(5,1fr)] gap-px bg-border rounded-lg overflow-hidden shadow-xl" style={{ fontSize: '0.75rem' }}>
            {/* Header */}
            <div className="bg-card p-2 select-none"></div>
            {DAYS.map((day) => (
              <div key={day} className="bg-card p-2 text-center font-semibold text-foreground border-b border-border select-none text-xs">
                {day}
              </div>
            ))}

            {/* Time slots and schedule */}
            {TIME_SLOTS.map((time, timeIndex) => (
              <>
                <div key={`time-${time}`} className="bg-card p-1 text-[10px] text-muted-foreground font-medium border-r border-border select-none flex items-center">
                  {time}
                </div>
                {DAYS.map((_, dayIndex) => {
                  const course = schedule.find(
                    (c) => c.day === dayIndex && c.startTime === timeIndex
                  );

                  const isGathering = gatheringCRN && course?.crn === gatheringCRN;

                  return (
                    <div
                      key={`${dayIndex}-${timeIndex}`}
                      className="bg-card p-1 min-h-[30px] border-b border-r border-border/50 relative select-none"
                      onDragOver={(e) => {
                        if (draggedSection) {
                          e.preventDefault();
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleCalendarDrop(dayIndex, timeIndex);
                      }}
                    >
                      {course && course.room !== "Asynchronous" && (
                        <div
                          draggable
                          onDragStart={() => handleCourseDragStart(course)}
                          onDragEnd={handleCourseDragEnd}
                          onMouseEnter={() => setHoveredCRN(course.crn)}
                          onMouseLeave={() => setHoveredCRN(null)}
                          className={`absolute inset-1 rounded-lg shadow-lg p-2 text-white hover:shadow-xl transition-all cursor-move z-10 select-none ${
                            snapAnimating === course.crn ? "animate-snap-in" : ""
                          } ${isGathering ? "animate-gather" : ""} ${
                            isDragging && draggedCourse?.crn === course.crn ? "animate-swing opacity-80" : ""
                          } ${hoveredCRN === course.crn ? "animate-pulse scale-[1.02]" : ""}`}
                          style={{
                            height: `calc(${course.duration * 100}% + ${(course.duration - 1) * 2}px)`,
                            background: getCampusGradient(course.campus),
                          }}
                        >
                          <div className="font-bold text-[10px] pointer-events-none">{course.code}</div>
                          <div className="text-[8px] opacity-90 mt-0.5 pointer-events-none">{course.room}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>

        {/* Asynchronous Online Classes */}
        {asyncOnlineCourses.length > 0 && (
          <div className="mt-4 p-4 bg-card border border-border rounded-lg">
            <h3 className="text-sm font-semibold text-foreground mb-3">Asynchronous Online Classes</h3>
            <div className="space-y-2">
              {Array.from(new Set(asyncOnlineCourses.map(c => c.crn))).map(crn => {
                const course = asyncOnlineCourses.find(c => c.crn === crn)!;
                return (
                  <div key={crn} className="p-3 bg-sidebar-accent/50 rounded-lg border border-sidebar-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm" style={{ color: '#0900FF' }}>
                          {course.code} - {course.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">CRN {crn} • {course.room}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSchedule(schedule.filter(c => c.crn !== crn))}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseScheduler;
