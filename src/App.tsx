import React, { useState } from 'react';
import { Calendar, Users, Truck, ClipboardCheck, BarChart3, Plus, DollarSign, Clock, CheckCircle2, Circle, AlertCircle, X, ChevronDown } from 'lucide-react';

interface Task {
  id: number;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

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
    // {
    //   id: 1,
    //   name: 'مشروع برج السكني',
    //   progress: 65,
    //   workers: 45,
    //   equipment: ['حفارة', 'رافعة', 'خلاطة'],
    //   budget: 2000000,
    //   spent: 1300000,
    //   startDate: '2024-03-01',
    //   endDate: '2024-12-31',
    //   tasks: [
    //     { id: 1, name: 'حفر الأساسات', status: 'completed', dueDate: '2024-03-15' },
    //     { id: 2, name: 'صب الخرسانة', status: 'in-progress', dueDate: '2024-04-01' },
    //     { id: 3, name: 'تركيب الهيكل المعدني', status: 'pending', dueDate: '2024-05-01' }
    //   ]
    // },
    // {
    //   id: 2,
    //   name: 'تطوير الطريق السريع',
    //   progress: 30,
    //   workers: 28,
    //   equipment: ['معدات رصف', 'شاحنة'],
    //   budget: 1500000,
    //   spent: 450000,
    //   startDate: '2024-02-15',
    //   endDate: '2024-08-30',
    //   tasks: [
    //     { id: 1, name: 'إزالة الطبقة القديمة', status: 'completed', dueDate: '2024-03-01' },
    //     { id: 2, name: 'تمهيد الأرض', status: 'in-progress', dueDate: '2024-03-30' },
    //     { id: 3, name: 'رصف الطبقة الأولى', status: 'pending', dueDate: '2024-04-15' }
    //   ]
    // }
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

  const handleRemoveTask = (taskId: number) => {
    setNewProject({
      ...newProject,
      tasks: newProject.tasks.filter(task => task.id !== taskId)
    });
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
        
        // Calculate new progress based on completed tasks
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
          { <button
            onClick={() => setShowNewProject(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5 ml-2" />
            مشروع جديد
          </button> } 
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

        {showNewProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto py-10">
            <div className="bg-white p-6 rounded-lg w-[600px] max-w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">إضافة مشروع جديد</h3>
                <button
                  onClick={() => setShowNewProject(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المشروع
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="أدخل اسم المشروع"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      عدد العمال
                    </label>
                    <input
                      type="number"
                      value={newProject.workers}
                      onChange={(e) => setNewProject({ ...newProject, workers: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الميزانية
                    </label>
                    <input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ البداية
                    </label>
                    <input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ النهاية
                    </label>
                    <input
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المعدات
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newProject.newEquipment}
                      onChange={(e) => setNewProject({ ...newProject, newEquipment: e.target.value })}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                      placeholder="أدخل اسم المعدة"
                    />
                    <button
                      onClick={handleAddEquipment}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      إضافة
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newProject.equipment.map((item, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {item}
                        <button
                          onClick={() => handleRemoveEquipment(index)}
                          className="mr-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المهام
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newProject.newTask.name}
                      onChange={(e) => setNewProject({
                        ...newProject,
                        newTask: { ...newProject.newTask, name: e.target.value }
                      })}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                      placeholder="اسم المهمة"
                    />
                    <input
                      type="date"
                      value={newProject.newTask.dueDate}
                      onChange={(e) => setNewProject({
                        ...newProject,
                        newTask: { ...newProject.newTask, dueDate: e.target.value }
                      })}
                      className="w-40 p-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={handleAddTask}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      إضافة
                    </button>
                  </div>
                  <div className="space-y-2">
                    {newProject.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <div className="flex items-center">
                          <Circle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 mr-2">{task.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{task.dueDate}</span>
                          <button
                            onClick={() => handleRemoveTask(task.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={handleNewProject}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    إنشاء المشروع
                  </button>
                  <button
                    onClick={() => setShowNewProject(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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

function ProjectCard({ project, onUpdateTaskStatus }: { project: Project; onUpdateTaskStatus: (projectId: number, taskId: number, status: Task['status']) => void }) {
  const [showStatusMenu, setShowStatusMenu] = useState<number | null>(null);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'pending':
        return 'معلق';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
          <div className="flex items-center mt-2 space-x-4 space-x-reverse">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-500 ml-1" />
              <span className="text-sm text-gray-600">{project.workers} عامل</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-500 ml-1" />
              <span className="text-sm text-gray-600">{project.startDate} - {project.endDate}</span>
            </div>
          </div>
        </div>
        <div className="text-left">
          <div className="text-sm text-gray-600 mb-1">نسبة الإنجاز</div>
          <div className="flex items-center">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 mr-2">
              {project.progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">الميزانية</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-gray-500 ml-1" />
            <span className="text-sm text-gray-600">{project.spent.toLocaleString()} / {project.budget.toLocaleString()} ريال</span>
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(project.spent / project.budget) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">المهام</h4>
        <div className="space-y-2">
          {project.tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between bg-gray-50 p-2 rounded relative">
              <div className="flex items-center">
                {getStatusIcon(task.status)}
                <span className="text-sm text-gray-700 mr-2">{task.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{task.dueDate}</span>
                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(showStatusMenu === task.id ? null : task.id)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(task.status)}`}
                  >
                    {getStatusText(task.status)}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showStatusMenu === task.id && (
                    <div className="absolute left-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onUpdateTaskStatus(project.id, task.id, 'pending');
                            setShowStatusMenu(null);
                          }}
                          className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          معلق
                        </button>
                        <button
                          onClick={() => {
                            onUpdateTaskStatus(project.id, task.id, 'in-progress');
                            setShowStatusMenu(null);
                          }}
                          className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          قيد التنفيذ
                        </button>
                        <button
                          onClick={() => {
                            onUpdateTaskStatus(project.id, task.id, 'completed');
                            setShowStatusMenu(null);
                          }}
                          className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          مكتمل
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.equipment.map((item, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
