import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/pages/Dashboard";

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSuccess: () => void;
}

const StudentDialog = ({ open, onOpenChange, student, onSuccess }: StudentDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    enrollment: "",
    birth_date: "",
    email: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        enrollment: student.enrollment,
        birth_date: student.birth_date,
        email: student.email,
        status: student.status,
      });
    } else {
      setFormData({
        name: "",
        enrollment: "",
        birth_date: "",
        email: "",
        status: "active",
      });
    }
  }, [student, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      if (student) {
        const { error } = await supabase
          .from("students")
          .update(formData)
          .eq("id", student.id);

        if (error) throw error;

        toast({
          title: "Aluno atualizado",
          description: "As informações foram atualizadas com sucesso",
        });
      } else {
        const { error } = await supabase.from("students").insert({
          ...formData,
          created_by: user.id,
        });

        if (error) throw error;

        toast({
          title: "Aluno cadastrado",
          description: "O aluno foi adicionado com sucesso",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o aluno",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{student ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enrollment">Matrícula *</Label>
            <Input
              id="enrollment"
              value={formData.enrollment}
              onChange={(e) => setFormData({ ...formData, enrollment: e.target.value })}
              required
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date">Data de Nascimento *</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : student ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDialog;
