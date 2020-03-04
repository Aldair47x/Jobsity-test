import React from "react";
import Code from "@material-ui/icons/Code";
import StarBorder from "@material-ui/icons/StarBorder";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";


import { mandatory, optional } from "variables/general.js";


export default function Dashboard() {
  
  return (
    <div>
      <GridContainer>
        <GridItem xs={11} sm={11} md={11}>
          <CustomTabs
            title="Tasks:"
            headerColor="primary"
            tabs={[
              {
                tabName: "Mandatory Features",
                tabIcon: Code,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0, 1, 2, 3, 4]}
                    tasksIndexes={[0, 1, 2, 3, 4, 5]}
                    tasks={mandatory}
                  />
                )
              },
              {
                tabName: "Bonus (Optional)",
                tabIcon: StarBorder,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0, 1, 2]}
                    tasksIndexes={[0, 1, 2]}
                    tasks={optional}
                  />
                )
              }
        
            ]}
          />
        </GridItem>
        
      </GridContainer>
    </div>
  );
}
