import * as React from "react";
import { Button, Icon, Row, Col } from "antd";
import { Helmet } from "react-helmet";
import reachGoal, { trackEvent } from "modules/utils/analytics";
import { connect } from "react-redux";
import { IAppStore } from "reducers";
import { checkAuth, IUser } from "modules/auth";
import { Link } from "react-router-dom";
import PricingTable, { Plan } from "components/blocks/PricingTable";
import { push, LocationAction } from "react-router-redux";
import ProductIntro from "components/blocks/ProductIntro";
import WhyUs from "components/blocks/WhyUs";
import SupportedLinters from "components/blocks/SupportedLinters";
import WhyDoYouNeedIt from "components/blocks/WhyDoYouNeedIt";
import Customers from "components/blocks/Customers";

interface IStateProps {
  currentUser?: IUser;
}

interface IDispatchProps {
  checkAuth(): void;
  push: LocationAction;
}

interface IProps extends IStateProps, IDispatchProps {}

class Home extends React.Component<IProps> {
  public componentWillMount() {
    this.props.checkAuth();
  }

  private renderLintersSection() {
    return <SupportedLinters showDetails={false}/>;
  }

  private onGithubAuthClick(): boolean {
    reachGoal("auth", "go_to_github");
    trackEvent("clicked on github auth btn");
    return true;
  }

  private renderPrimaryButton() {
    return this.props.currentUser ? (
      <Link to="/repos/github">
        <Button onClick={this.onGithubAuthClick} type="primary" size="large">
          <Icon type="bars" />
          My Repos
        </Button>
      </Link>
    ) : (
      <a href={`${API_HOST}/v1/auth/github`}>
        <Button onClick={this.onGithubAuthClick} type="primary" size="large">
          <Icon type="github" />
          Signup via GitHub
        </Button>
      </a>
    );
  }

  private renderJumbotron() {
    return (
      <section className="home-jumbotron">
        <Row type="flex" justify="center">
          <h1 className="home-jumbotron-header">Continuous Code Quality for Go</h1>
        </Row>
        <Row type="flex" justify="center">
          <p className="home-jumbotron-subheader">GolangCI detects and comments issues in GitHub pull requests: bugs, style violations, anti-pattern instances</p>
        </Row>
        <Row type="flex" justify="center">
          {this.renderPrimaryButton()}
        </Row>
      </section>
    );
  }

  private renderWhyDoYouNeedSection() {
    return <WhyDoYouNeedIt/>;
  }

  private renderGithubIntegrationSection() {
    return <ProductIntro showLinkOnMoreDetails />;
  }

  private onPricingPlanChoose(chosenPlan: Plan) {
    if (chosenPlan === Plan.Enterprise) {
      window.location.replace(`mailto:denis@golangci.com`);
      return;
    }

    if (!this.props.currentUser) {
      window.location.replace(`${API_HOST}/v1/auth/github`);
      return;
    }

    this.props.push("/repos/github");
  }

  private renderPricingSection() {
    return (
      <section className="home-section-gradient home-section">
        <div className="home-section-content">
          <Row type="flex" justify="center">
            <p id="pricing" className="home-section-header home-section-gradient-header">Pricing</p>
          </Row>

          <PricingTable
            authorized={this.props.currentUser ? true : false}
            onButtonClick={this.onPricingPlanChoose.bind(this)}
          />

        </div>
      </section>
    );
  }

  private renderWhyUsSection() {
    return <WhyUs/>;
  }

  private renderHead() {
    return <Helmet title="Automated code review for Go" />;
  }

  private renderLearnMore() {
    return (
      <section className="home-section home-section-padded">
        <div className="home-section-content">
          <Row type="flex" justify="center">
              <p className="home-section-header">Product</p>
          </Row>

          <Row type="flex" justify="center">
            <div className="full-screen-image">
              <p className="home-section-text">
                GolangCI can automatically fix issues, provides a convenient control panel, shows analysis reports and build logs,
                allows defining custom build steps and much more.
              </p>
            </div>
          </Row>
          <Row type="flex" justify="center">
            <Link to="/product">
              <Button type="primary" size="large">
                <Icon type="radar-chart" />
                Learn more about the product
              </Button>
            </Link>
          </Row>
        </div>
    </section>
    );
  }

  private renderCustomersSection() {
    return <Customers/>;
  }

  public render() {
    return (
      <>
        {this.renderHead()}
        {this.renderJumbotron()}
        {this.renderGithubIntegrationSection()}
        {this.renderLintersSection()}
        {this.renderWhyDoYouNeedSection()}
        {this.renderWhyUsSection()}
        {this.renderCustomersSection()}
        {this.renderLearnMore()}
        {this.renderPricingSection()}
      </>
    );
  }
}

const mapStateToProps = (state: IAppStore): any => ({
  currentUser: state.auth.currentUser,
});

const mapDispatchToProps = {
  checkAuth,
  push,
};

export default connect<IStateProps, IDispatchProps, void>(mapStateToProps, mapDispatchToProps)(Home);
