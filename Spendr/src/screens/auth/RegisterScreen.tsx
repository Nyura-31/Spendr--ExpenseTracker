import { AuthForm } from "../../components/auth/AuthForm";
import { useAuth } from "../../context/AuthContext";

interface RegisterScreenProps {
  onShowLogin: () => void;
}

export default function RegisterScreen({ onShowLogin }: RegisterScreenProps) {
  const { register } = useAuth();

  return <AuthForm mode="register" onSubmit={register} onSwitchMode={onShowLogin} />;
}
