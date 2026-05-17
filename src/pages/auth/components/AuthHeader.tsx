import SiteLogo from '../../../assets/logo.png';
import './AuthHeader.css';

type Props = {
  logoHeight?: number; // in px
  href?: string; // default '/'
};

export default function AuthHeader({ href = '/' }: Props) {
  return (
    <div className="auth-header">
      <a href={href} aria-label="TrainMate home">
        <img src={SiteLogo} alt="TrainMate" />
      </a>
    </div>
  );
}