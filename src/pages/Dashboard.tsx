import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, LogOut, Plus, Search, UserCircle } from "lucide-react";
import StudentTable from "@/components/StudentTable";
import StudentDialog from "@/components/StudentDialog";

export interface Student {
  id: string;
  name: string;
  enrollment: string;
  birth_date: string;
  email: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollment.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserName(profile.full_name);
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roles) {
        setUserRole(roles.role);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const typedData = (data || []) as Student[];
      setStudents(typedData);
      setFilteredStudents(typedData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar alunos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setDialogOpen(true);
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este aluno?")) {
      return;
    }

    try {
      const { error } = await supabase.from("students").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Aluno excluído",
        description: "O aluno foi removido com sucesso",
      });

      fetchStudents();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir aluno",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isAdmin = userRole === "admin";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Sistema de Gestão Escolar</h1>
                <p className="text-sm text-muted-foreground">Gerenciamento de Alunos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {isAdmin && (
            <Button onClick={handleAddStudent}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Aluno
            </Button>
          )}
        </div>

        <StudentTable
          students={filteredStudents}
          isLoading={isLoading}
          isAdmin={isAdmin}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />

        <StudentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          student={editingStudent}
          onSuccess={fetchStudents}
        />
      </main>
    </div>
  );
};

export default Dashboard;
