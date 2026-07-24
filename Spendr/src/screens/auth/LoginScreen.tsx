import { AuthForm } from "../../components/auth/AuthForm";
import { useAuth } from "../../context/AuthContext";

interface LoginScreenProps {
  onShowRegister: () => void;
}

export default function LoginScreen({ onShowRegister }: LoginScreenProps) {
  const { login } = useAuth();

  return <AuthForm mode="login" onSubmit={login} onSwitchMode={onShowRegister} />;
}
