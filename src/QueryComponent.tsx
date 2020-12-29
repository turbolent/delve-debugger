import { Wikidata } from "./wikidata"
import { Controlled as CodeMirror } from "react-codemirror2"
import "codemirror/lib/codemirror.css"
import "codemirror/theme/neo.css"
import "codemirror/mode/sparql/sparql.js"
import "./QueryComponent.css"
import * as React from "react"
import { EditorConfiguration } from "codemirror"
import OpenIcon from "@material-ui/icons/OpenInNew"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import { ReactElement } from "react"

interface Props {
  readonly query: string
}

export default class QueryComponent extends React.Component<Props> {
  private static options: EditorConfiguration = {
    mode: "application/sparql-query",
    readOnly: "nocursor",
    theme: "neo",
    lineNumbers: true,
  }

  render(): ReactElement {
    const { query } = this.props
    const link = Wikidata.getQueryURL(query)
    return (
      <div className="Query">
        <CodeMirror
          className="QueryText"
          value={query}
          options={QueryComponent.options}
          onBeforeChange={() => undefined}
        />
        <div className="QueryActions">
          <Tooltip title="Open in Query Editor">
            <IconButton
              color="primary"
              component={React.forwardRef<HTMLAnchorElement>(function IconLink(
                props,
                ref
              ) {
                return (
                  <a
                    ref={ref}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    {...props}
                  />
                )
              })}
            >
              <OpenIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    )
  }
}
