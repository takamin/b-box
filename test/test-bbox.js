"use strict";
const assert = require("chai").assert;
const BBox = require("../b-box.js");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
function createBBox(html) {
    const dom = new JSDOM(html);
    let window = dom.window;
    let document = window.document;

    let element = document.getElementById("testTarget");
    let bbox = new BBox(element, { context: window });
    return bbox;
}
describe("class BBox", () => {
    let html = [
        "<!DOCTYPE html>",
        "<div id='testTarget' style='position:relative;",
            "top:123px;", "left:45px;", "right:670px;", "bottom:369px;",
            "width:625px;", "height:246px;",
            "margin-top:1px;", "margin-left:2px;",
            "margin-right:3px;", "margin-bottom:4px;",
            "padding-top:5px;", "padding-left:16px;",
            "padding-right:17px;", "padding-bottom:8px;",
            "border-top-width:9px;", "border-left-width:10px;",
            "border-right-width:11px;", "border-bottom-width:12px;",
        "'>CSS TOP</div>"].join("");
    describe("ctor", () => {
        let bbox = createBBox(html);
        describe("primary properties initialization", () => {
            it("should has a css top", () => {
                assert.equal(bbox.top, "123px");
            });
            it("should has a css left", () => {
                assert.equal(bbox.left, "45px");
            });
            it("should has a css right", () => {
                assert.equal(bbox.right, "670px");
            });
            it("should has a css bottom", () => {
                assert.equal(bbox.bottom, "369px");
            });
            it("should has a css width", () => {
                assert.equal(bbox.width, "625px");
            });
            it("should has a css height", () => {
                assert.equal(bbox.height, "246px");
            });
            it("should has a css margin-top", () => {
                assert.equal(bbox["margin-top"], "1px");
            });
            it("should has a css margin-left", () => {
                assert.equal(bbox["margin-left"], "2px");
            });
            it("should has a css margin-right", () => {
                assert.equal(bbox["margin-right"], "3px");
            });
            it("should has a css margin-bottom", () => {
                assert.equal(bbox["margin-bottom"], "4px");
            });
            it("should has a css padding-top", () => {
                assert.equal(bbox["padding-top"], "5px");
            });
            it("should has a css padding-left", () => {
                assert.equal(bbox["padding-left"], "16px");
            });
            it("should has a css padding-right", () => {
                assert.equal(bbox["padding-right"], "17px");
            });
            it("should has a css padding-bottom", () => {
                assert.equal(bbox["padding-bottom"], "8px");
            });
            it("should has a css border-top-width", () => {
                assert.equal(bbox["border-top-width"], "9px");
            });
            it("should has a css border-left-width", () => {
                assert.equal(bbox["border-left-width"], "10px");
            });
            it("should has a css border-right-width", () => {
                assert.equal(bbox["border-right-width"], "11px");
            });
            it("should has a css border-bottom-width", () => {
                assert.equal(bbox["border-bottom-width"], "12px");
            });
        });
        describe("#px()", ()=> {
            it("should convert property to number from string", ()=> {
                assert.equal(bbox.px("top"), 123);
            });
        });
        describe("#marginTopNc()", () => {
            it("should returns margin-top + padding-top as number by pixel", ()=>{
                assert.equal(bbox.marginTopNc(), 6);
            });
        });
        describe("#marginLeftNc()", () => {
            it("should returns margin-left + padding-left as number by pixel", ()=>{
                assert.equal(bbox.marginLeftNc(), 18);
            });
        });
        describe("#marginRightNc()", () => {
            it("should returns margin-right + padding-right as number by pixel", ()=>{
                assert.equal(bbox.marginRightNc(), 20);
            });
        });
        describe("#marginBottomNc()", () => {
            it("should returns margin-bottom + padding-bottom as number by pixel", ()=>{
                assert.equal(bbox.marginBottomNc(), 12);
            });
        });
        describe("#marginVerticalNc()", () => {
            it("should returns marginTopNc() + marginBottomNc() as number by pixel", ()=>{
                assert.equal(bbox.marginVerticalNc(), 18);
            });
        });
        describe("#marginHorizontalNc()", () => {
            it("should returns marginLeftNc() + marginRightNc() as number by pixel", ()=>{
                assert.equal(bbox.marginHorizontalNc(), 38);
            });
        });
    });
    describe("BBox.update()", ()=> {
        let bbox = createBBox(html);
        bbox._element.style.top = "10px";
        bbox._element.style.left = "20px";
        bbox._element.style.right = "30px";
        bbox._element.style.bottom = "40px";
        bbox.update();
        it("should update top", ()=>{
            assert.equal(bbox.top, "10px");
        });
        it("should update left", ()=>{
            assert.equal(bbox.left, "20px");
        });
        it("should update right", ()=>{
            assert.equal(bbox.right, "30px");
        });
        it("should update bottom", ()=>{
            assert.equal(bbox.bottom, "40px");
        });
    });
});
describe("class BBox.Size", () => {
    describe("#getAspectRatio", ()=>{
        it("should returns 2.0 for 2:1", ()=>{
            let size = new BBox.Size(2,1);
            assert(size.getAspectRatio(), 2);
        });
        it("should returns 0.5 for 1:2", ()=>{
            let size = new BBox.Size(1,2);
            assert(size.getAspectRatio(), 0.5);
        });
    });
    describe("#getMaxInscribedSize", ()=>{
        describe("the container size is large", ()=>{
            it("should return when the container's aspect ratio is large", ()=>{
                let container = new BBox.Size(20,10);
                let original = new BBox.Size(1,2);
                let inscribed = container.getMaxInscribedSize(original);
                assert.equal(inscribed._w, 5);
                assert.equal(inscribed._h, 10);
            });
            it("should return when the container's aspect ratio is small", ()=>{
                let container = new BBox.Size(10,20);
                let original = new BBox.Size(2,1);
                let inscribed = container.getMaxInscribedSize(original);
                assert.equal(inscribed._w, 10);
                assert.equal(inscribed._h, 5);
            });
            it("should return when the container's aspect ratio is same", ()=>{
                let container = new BBox.Size(10,10);
                let original = new BBox.Size(1,1);
                let inscribed = container.getMaxInscribedSize(original);
                assert.equal(inscribed._w, 10);
                assert.equal(inscribed._h, 10);
            });
        });
        describe("the container size is small", ()=>{
            it("should work when the container's aspect ratio is large", ()=>{
                let container = new BBox.Size(20,10);
                let original = new BBox.Size(100,200);
                let inscribed = container.getMaxInscribedSize(original);
                assert.equal(inscribed._w, 5);
                assert.equal(inscribed._h, 10);
            });
            it("should work when the container's aspect ratio is small", ()=>{
                let container = new BBox.Size(10,20);
                let original = new BBox.Size(200,100);
                let inscribed = container.getMaxInscribedSize(original);
                assert.equal(inscribed._w, 10);
                assert.equal(inscribed._h, 5);
            });
            it("should work when the container's aspect ratio is same", ()=>{
                let container = new BBox.Size(10,10);
                let original = new BBox.Size(100,100);
                let inscribed = container.getMaxInscribedSize(original);
                assert.equal(inscribed._w, 10);
                assert.equal(inscribed._h, 10);
            });
        });
    });
});
describe("class BBox.Rect", () => {
    describe("ctor", ()=>{
        it("should initialize all properties zero", ()=> {
            let rect = new BBox.Rect();
            assert.equal(rect.top, 0);
            assert.equal(rect.left, 0);
            assert.equal(rect.right, 0);
            assert.equal(rect.bottom, 0);
        });
        it("should initialize all properties by parameters", ()=> {
            let rect = new BBox.Rect(1,2,3,4);
            assert.equal(rect.top, 1);
            assert.equal(rect.left, 2);
            assert.equal(rect.right, 3);
            assert.equal(rect.bottom, 4);
        });
    });
    describe("#clone()", ()=>{
        it("should be cloned as same properties", ()=> {
            let original = new BBox.Rect(1,2,3,4);
            let clone = BBox.Rect.clone(original);
            original.top = 0;
            original.left = 0;
            original.right = 0;
            original.bottom = 0;
            assert.equal(clone.top, 1);
            assert.equal(clone.left, 2);
            assert.equal(clone.right, 3);
            assert.equal(clone.bottom, 4);
        });
    });
});
describe("Conversion between BBox and BBox.Rect", ()=>{
    let html = [
        "<!DOCTYPE html>",
        "<div id='testTarget' style='position:relative;",
            "top:123px;", "left:45px;", "right:670px;", "bottom:369px;",
            "width:625px;", "height:246px;",
            "margin-top:1px;", "margin-left:2px;",
            "margin-right:3px;", "margin-bottom:4px;",
            "padding-top:5px;", "padding-left:16px;",
            "padding-right:17px;", "padding-bottom:8px;",
            "border-top-width:9px;", "border-left-width:10px;",
            "border-right-width:11px;", "border-bottom-width:12px;",
        "'>CSS TOP</div>"].join("");
    describe("BBox.setBound()", ()=> {
        let bbox = createBBox(html);
        bbox.setBound(new BBox.Rect(10,20,30,40));
        it("should set style.top", ()=>{
            assert.equal(bbox._element.style.top, "10px");
        });
        it("should set style.left", ()=>{
            assert.equal(bbox._element.style.left, "20px");
        });
        it("should set style.right", ()=>{
            assert.equal(bbox._element.style.right, "30px");
        });
        it("should set style.bottom", ()=>{
            assert.equal(bbox._element.style.bottom, "40px");
        });
    });
    describe("BBox.Rect.fromBBox()", ()=> {
        let bbox = createBBox(html);
        let rect = BBox.Rect.fromBBox(bbox);
        it("should set top as BBox.marginTopNc()", ()=>{
            assert.equal(rect.top, 6);
        });
        it("should set left as BBox.marginLeftNc()", ()=>{
            assert.equal(rect.left, 18);
        });
        it("should set right as BBox.marginLeftNc() + BBox.width - BBox.marginRightNc()", ()=>{
            assert.equal(rect.right, 18 + 625 - 20);
        });
        it("should set bottom as BBox.marginTopNc() + BBox.height - BBox.marginBottomNc()", ()=>{
            assert.equal(rect.bottom, 6 + 246 - 12);
        });
    });
});
