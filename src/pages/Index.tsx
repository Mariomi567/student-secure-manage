import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="text-center space-y-6 p-8">
        <GraduationCap className="h-20 w-20 text-primary mx-auto" />
        <h1 className="text-5xl font-bold">Sistema de Gestão Escolar</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Gerencie alunos de forma simples, eficiente e segura
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button size="lg" onClick={() => navigate("/auth")}>
            Acessar Sistema
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
