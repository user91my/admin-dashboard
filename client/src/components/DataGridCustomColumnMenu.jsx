import {
  GridColumnMenuContainer,
  GridColumnMenuFilterItem,
  GridColumnMenuHideItem,
} from "@mui/x-data-grid";

const CustomColumnMenu = (props) => {
  const { hideMenu, open, colDef } = props; // Default props needed to be passed into 'GridColumnMenuContainer' component.
  return (
    <GridColumnMenuContainer
      hideMenu={hideMenu}
      open={open}
      colDef={colDef} // replaces deprecated 'currentColumn' prop
    >
      {/* By default, datagrid requires 'onClick' and 'colDef' props to be specified */}
      {/* for both "GridColumnMenuFilterItem" and "GridColumnMenuHideItem" components. */}
      <GridColumnMenuFilterItem onClick={hideMenu} colDef={colDef} />
      <GridColumnMenuHideItem onClick={hideMenu} colDef={colDef} />
    </GridColumnMenuContainer>
  );
};

export default CustomColumnMenu;
