import { Box, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Page from "src/components/Page";
import useUserSearch from "src/hooks/useUserSearch";
import { enumPropertyType, Property } from "src/ObjMgr/Property";
import showLoading from "src/util/ShowLoading";
import showMessage from "src/util/ShowMessage";
import Filter from "./components/Filter";
import PropertyList from "./components/PropertyList";
import { FilterClass } from "./DataObj/DataObj";

export interface TFilterProperty {
  _id: string;
  images: string[];
  name: string;
  city: string;
  amenities: string[];
  jobHiring: boolean;
  avgRating: number;
  totalReviews: number;
  totalRooms: number;
  avpPrice: number;
  propertyType: enumPropertyType;
}

export default function PropertyListByState() {
  const [searchParam, setSearchParams] = useSearchParams();
  const _ParamValue_ = useParams();
  const {
    UserSearchObj: { selectedState },
  } = useUserSearch();
  const [FilteredPropertyList, setFilteredPropertyList] = useState<
    TFilterProperty[]
  >([]);

  const theme = useTheme();

  useEffect(() => {
    let newSearchObj: any = {};

    if (_ParamValue_ !== null && _ParamValue_ !== undefined) {
      newSearchObj["country"] = _ParamValue_.country;
      newSearchObj["state"] = _ParamValue_.state;
    }

    if (searchParam.size > 0) {
      for (const [key, value] of searchParam) {
        newSearchObj[key] = value;
      }
    }

    if (Number(newSearchObj.page) < 0 || newSearchObj.page === undefined) {
      newSearchObj["page"] = "1";
    }

    showLoading(theme, true);
    Property.GetPropertyListByFilterSearch(
      newSearchObj,
      (res) => {
        setFilteredPropertyList(res);
        showLoading(theme, false);
      },
      (err) => {
        showMessage(err, theme, () => {});
        showLoading(theme, false);
      }
    );
  }, [searchParam, _ParamValue_]);

  const onSearchbyFilter = (objFilter: FilterClass) => {
    const ParamObj = getParamObject(objFilter);

    const queryString = createQueryString(ParamObj);
    setSearchParams(queryString);
  };

  return (
    <Page title={selectedState}>
      <Rootstyle>
        <Filter onSearchbyFilter={onSearchbyFilter} />
        <PropertyList FilteredPropertyList={FilteredPropertyList} />
      </Rootstyle>
    </Page>
  );
}

const Rootstyle = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  gap: "1rem",
}));

const getParamObject = (objFilter: FilterClass) => {
  let ParamObj = {};
  ParamObj["Price"] = objFilter.Price;
  if (objFilter.propertyType.length > 0) {
    ParamObj["propertyType"] = objFilter.propertyType.join(",");
  }
  if (objFilter.city.length > 0) {
    ParamObj["city"] = objFilter.city.join(",");
  }
  return ParamObj;
};

const createQueryString = (params) => {
  let queryString = "";
  for (const key in params) {
    if (params[key]) {
      queryString += `${key}=${params[key]}&`;
    }
  }
  queryString = queryString.slice(0, -1);
  return queryString;
};
