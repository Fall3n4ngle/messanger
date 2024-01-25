type Props = {
  sentence: string;
  maxLength: number;
};

export const shortenSentence = ({ maxLength, sentence }: Props) => {
  if (sentence.length <= maxLength) {
    return sentence;
  }

  return sentence.slice(0, maxLength) + "...";
};
