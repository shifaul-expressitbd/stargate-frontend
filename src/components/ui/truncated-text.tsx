import { Tooltip } from "./tooltip";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength = 100,
  className,
}) => {
  return (
    <Tooltip
      content={text}
      position="left"
      className="max-w-fit w-36 md:w-48 lg:w-72"
    >
      <span
        className={`truncate w-28 inline-block cursor-pointer ${className}`}
      >
        {text.length > maxLength ? `${text.slice(0, maxLength)}...` : text}
      </span>
    </Tooltip>
  );
};

export default TruncatedText;
