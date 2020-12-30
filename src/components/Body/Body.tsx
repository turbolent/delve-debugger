import * as React from "react"
import TokensComponent from "../Tokens/Tokens"
import SectionComponent from "../Section/Section"
import ErrorComponent from "../Error/Error"
import TreeComponent from "../Tree/Tree"
import QueriesComponent from "../Queries/Queries"
import GraphsComponent from "../Graphs/Graphs"
import "./Body.css"
import { ReactElement } from "react"

export default function Body(): ReactElement {
  return (
    <div className="Body">
      <SectionComponent title="Error" path={["error"]}>
        <ErrorComponent />
      </SectionComponent>
      <SectionComponent title="Tokens" path={["parse", "tokens"]}>
        <TokensComponent />
      </SectionComponent>
      <SectionComponent title="Tree" path={["parse", "tree"]}>
        <TreeComponent />
      </SectionComponent>
      <SectionComponent title="Graph" path={["parse", "nodes"]}>
        <GraphsComponent parseProperty="nodes" />
      </SectionComponent>
      <SectionComponent
        title="Expanded Graph"
        path={["parse", "expanded_nodes"]}
      >
        <GraphsComponent parseProperty="expanded_nodes" />
      </SectionComponent>
      <SectionComponent title="Queries" path={["parse", "queries"]}>
        <QueriesComponent />
      </SectionComponent>
    </div>
  )
}
