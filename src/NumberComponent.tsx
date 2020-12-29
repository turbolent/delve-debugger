import * as React from "react";
import {ReactElement} from "react";

interface Props {
  unit?: { name: string };
  value: number;
}

function NumberComponent({value, unit}: Props): ReactElement {
  const suffix = unit ? `(${unit.name})` : "";
  return (
    <div>
      {value} {suffix}
    </div>
  );
}

export default NumberComponent;
