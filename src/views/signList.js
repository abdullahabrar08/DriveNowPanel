import React from "react";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";
import axios from "axios";
// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import Loader from 'react-loader-spinner';
import { thead, tbody } from "variables/general";

class signList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: false,
      ordersData: "",
      isLoading: true
    };
  }

  componentDidMount() {
    this.getOrdersFromDatabase();
  }

  getOrdersFromDatabase() {
    axios
      .get("http://ec2-34-227-47-234.compute-1.amazonaws.com:3000/quiz/api/getSigns")
      .then((res) => {
        console.log("response : ",res);
        if (res.data.status === 200) {
          this.productStatus = "";
          this.setState({
            order: true,
            ordersData: res,
          });
          console.log("order data  :",this.state.ordersData);
        } else {
          this.productStatus = "No Sign Exist";
          this.setState({
            order: false,
            isLoading: false
          });
        }
      })
      .catch((err) => {
        this.productStatus =
          " An error occured while fetching Sign's List";
        this.setState({
          order: false,
          isLoading: false
        });
      });
  }

  showSignImage(url) {
    return (
          <img
          style={{width: 80, height:80}}
          alt="..."
          src={url}
        />
    );
  }

  statusButton(index) {
    return (
      <button
        type="button"
        class="btn btn-danger"
        onClick={() => this.changestatus(index)}
      >
        Delete
      </button>
    );
  }

  changestatus = (index) => {
    axios
      .post(
        "http://ec2-34-227-47-234.compute-1.amazonaws.com:3000/quiz/api/deleteSign",
        {
          id: this.state.ordersData.data.feed[index].id,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if(res.data.status == 200){
          this.getOrdersFromDatabase();
        }
      })
      .catch((err) => {});
  };

  renderTableData() {
    return (
      <Table striped bordered hover>
        <thead class="thead-dark">
          <tr>
            <th style={{ textAlign: "center" }}>#</th>
            <th style={{ textAlign: "center" }}>Sign Image</th>
            <th style={{ textAlign: "center" }}>Sign Title</th>
            <th style={{ textAlign: "center" }}>Sign Type</th>
            <th style={{ textAlign: "center" }}>Description</th>
            <th style={{ textAlign: "center" }}>Remove</th>
          </tr>
        </thead>
        <tbody>
          {this.state.ordersData.data.feed.map((order, index) => {
            const { title, signType, description, url } = order;
            return (
              <tr>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td style={{ textAlign: "center" }}>
                  {this.showSignImage(url)}
                </td>
                <td style={{ textAlign: "center" }}> {title}</td>
                <td style={{ textAlign: "center" }}>{signType}</td>
                <td style={{ textAlign: "center" }}>{description}</td>
                <td style={{ textAlign: "center" }}>
                  {this.statusButton(index)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <>
        <PanelHeader size="sm" />
        <div className="content">
          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">View Signs List</CardTitle>
                </CardHeader>
                <CardBody>
                  {this.state.order ? (
                    this.renderTableData()
                  ) : (
                  <div>
                    <span style={{ color: "red" }}>{this.productStatus}</span>
                    {this.state.isLoading
                    ? <Loader
                    style={{textAlign: "center"}}
                    type="ThreeDots"
                    color="#00BFFF"
                    height={30}
                    width={30}
                   />
                    :  <span></span>
                    } 
                  </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default signList;
