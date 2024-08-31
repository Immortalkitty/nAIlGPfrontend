import classes from '../App.css';

function ErrorPageContent({ title, children }) {
  return (
    <div className={classes.AppResults}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export default ErrorPageContent;