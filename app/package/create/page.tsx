export default function CreatePackage() {
  return (
    <div>
      <section>
        <label>名字</label>
        <input />
      </section>
      <section>
        <label>编号</label>
        <input />
      </section>
      <section>
        <label>介绍</label>
        <input />
      </section>
      <section>
        <label>卡片数量</label>
        <input type="number" />
      </section>

      <div>
        <button>创建</button>
      </div>
    </div>
  );
}