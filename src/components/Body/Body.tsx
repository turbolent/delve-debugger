import React, { ReactElement } from "react"
import "./Body.css"
import Tokens from "../../containers/Tokens/Tokens"
import Section from "../../containers/Section/Section"
import Error from "../../containers/Error/Error"
import Tree from "../../containers/Tree/Tree"
import Queries from "../../containers/Queries/Queries"
import Graphs from "../../containers/Graphs/Graphs"

export default function Body(): ReactElement {
  return (
    <div className="Body">
      <Section title="Error" path={["error"]}>
        <Error />
      </Section>
      <Section title="Tokens" path={["parse", "tokens"]}>
        <Tokens />
      </Section>
      <Section title="Tree" path={["parse", "tree"]}>
        <Tree />
      </Section>
      <Section title="Graphs" path={["parse", "nodes"]}>
        <Graphs parseProperty="nodes" />
      </Section>
      <Section title="Expanded Graphs" path={["parse", "expanded_nodes"]}>
        <Graphs parseProperty="expanded_nodes" />
      </Section>
      <Section title="Queries" path={["parse", "queries"]}>
        <Queries />
      </Section>
    </div>
  )
}
