import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Student } from "@/pages/Dashboard";

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  isAdmin: boolean;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

const StudentTable = ({ students, isLoading, isAdmin, onEdit, onDelete }: StudentTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border">
        <p className="text-muted-foreground">Nenhum aluno encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Data de Nascimento</TableHead>
            <TableHead>Status</TableHead>
            {isAdmin && <TableHead className="text-right">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.enrollment}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{new Date(student.birth_date).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell>
                <Badge variant={student.status === "active" ? "default" : "secondary"}>
                  {student.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(student)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(student.id)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentTable;
