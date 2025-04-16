import React, { useState } from 'react';
import { Calendar, Users, Truck, ClipboardCheck, BarChart3, Plus, DollarSign, Clock, CheckCircle2, Circle, AlertCircle, X, ChevronDown } from 'lucide-react';



interface Project {
  id: number;
  name: string;
  progress: number;
  workers: number;
  equipment: string[];
  budget: number;
  spent: number;
  tasks: Task[];
  startDate: string;
  endDate: string;
}

interface NewProjectForm {
  name: string;
  workers: number;
  budget: number;
  startDate: string;
  endDate: string;
  equipment: string[];
  newEquipment: string;
  tasks: Task[];
  newTask: {
    name: string;
    dueDate: string;
  };
}

function App() {
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState<NewProjectForm>({
    name: '',
    workers: 0,
    budget: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    equipment: [],
    newEquipment: '',
    tasks: [],
    newTask: {
      name: '',
      dueDate: new Date().toISOString().split('T')[0]
    }
  });

  const [projects, setProjects] = useState<Project[]>([

  ]);

  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  const totalWorkers = projects.reduce((sum, project) => sum + project.workers, 0);
  const totalEquipment = projects.reduce((sum, project) => sum + project.equipment.length, 0);

  const handleAddEquipment = () => {
    if (newProject.newEquipment.trim()) {
      setNewProject({
        ...newProject,
        equipment: [...newProject.equipment, newProject.newEquipment.trim()],
        newEquipment: ''
      });
    }
  };

  const handleRemoveEquipment = (index: number) => {
    setNewProject({
      ...newProject,
      equipment: newProject.equipment.filter((_, i) => i !== index)
    });
  };

  const handleAddTask = () => {
    if (newProject.newTask.name.trim()) {
      setNewProject({
        ...newProject,
        tasks: [
          ...newProject.tasks,
          {
            id: newProject.tasks.length + 1,
            name: newProject.newTask.name.trim(),
            status: 'pending' as const,
            dueDate: newProject.newTask.dueDate
          }
        ],
        newTask: {
          name: '',
          dueDate: new Date().toISOString().split('T')[0]
        }
      });
    }
  };



  const handleNewProject = () => {
    if (!newProject.name || !newProject.budget || !newProject.workers) {
      alert('الرجاء إدخال جميع البيانات المطلوبة');
      return;
    }

    const projectToAdd: Project = {
      id: projects.length + 1,
      name: newProject.name,
      progress: 0,
      workers: newProject.workers,
      equipment: newProject.equipment,
      budget: newProject.budget,
      spent: 0,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      tasks: newProject.tasks
    };

    setProjects([...projects, projectToAdd]);
    setShowNewProject(false);
    setNewProject({
      name: '',
      workers: 0,
      budget: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      equipment: [],
      newEquipment: '',
      tasks: [],
      newTask: {
        name: '',
        dueDate: new Date().toISOString().split('T')[0]
      }
    });
  };

  const updateTaskStatus = (projectId: number, taskId: number, newStatus: Task['status']) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const updatedTasks = project.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, status: newStatus };
          }
          return task;
        });
        
        const completedTasks = updatedTasks.filter(task => task.status === 'completed').length;
        const progress = Math.round((completedTasks / updatedTasks.length) * 100);
        
        return { ...project, tasks: updatedTasks, progress };
      }
      return project;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة المشاريع الإنشائية</h1>
            <p className="text-gray-600">لوحة التحكم الرئيسية</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            title="المشاريع النشطة"
            value={projects.length.toString()}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="إجمالي العمال"
            value={totalWorkers.toString()}
            color="bg-green-500"
          />
          <StatCard
            icon={<Truck className="w-6 h-6" />}
            title="المعدات"
            value={totalEquipment.toString()}
            color="bg-yellow-500"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="الميزانية المستهلكة"
            value={`${Math.round((totalSpent / totalBudget) * 100)}%`}
            color="bg-purple-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">المشاريع الحالية</h2>
          <div className="space-y-6">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onUpdateTaskStatus={updateTaskStatus}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default App;
