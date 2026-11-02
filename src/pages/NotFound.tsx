import { Link } from 'react-router-dom';
import Icon from '../components/Icons';

export default function NotFound() {
  return (
    <div className="page not-found">
      <div className="not-found-mark">𝄢</div>
      <span className="eyebrow">404</span>
      <h1>This page is off the staff.</h1>
      <p>The note you were looking for is not here. Try the course path or return to today.</p>
      <div className="button-row">
        <Link className="button primary" to="/">
          Back to today
        </Link>
        <Link className="button secondary" to="/courses">
          Browse courses
          <Icon name="arrow" size={16} />
        </Link>
      </div>
    </div>
  );
}
