<template>
  <!-- <h4>Tab Area</h4>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, harum
    consectetur. Quas esse ipsum corporis, velit molestiae officia. Beatae animi
    exercitationem illum necessitatibus eligendi ipsam repudiandae fugit facere
    porro culpa est, voluptates, velit explicabo nihil accusantium? Corporis
    dignissimos, laboriosam quos mollitia accusantium rem, molestias culpa dolor
    perferendis inventore doloremque iusto reiciendis minus facilis recusandae
    illum, iste laudantium tempore! Voluptatum, recusandae! Blanditiis quasi
    laudantium cum temporibus eligendi animi sed soluta, asperiores id nobis
    eius voluptatem cumque omnis accusantium, qui atque incidunt eum fugiat,
    magnam explicabo iusto! Laudantium quam porro iure quos, voluptatum itaque
    molestiae. Laudantium libero, est voluptatem vitae magni et.
  </p> -->

  <div class="container">
    <div class="tabbed" ref="tabbed">
      <input
        v-if="global.state.mobileMode"
        checked="true"
        id="tab1"
        type="radio"
        name="tabs"
      />
      <input checked="true" id="tab2" type="radio" name="tabs" ref="tab2" />
      <input id="tab3" type="radio" name="tabs" />
      <input id="tab4" type="radio" name="tabs" />

      <nav>
        <label v-if="global.state.mobileMode" for="tab1">Graph[T]</label>
        <label for="tab2">Catsredirs[T]</label>
        <label for="tab3">Checkbox[T]</label>
        <label ref="label4" for="tab4">Maininfo[T]</label>
      </nav>

      <section>
        <div v-if="global.state.mobileMode" class="tab1">
          grapharea[T] Lorem ipsum dolor sit amet consectetur adipisicing elit.
          At nihil dicta, repellat laudantium, libero laboriosam facilis
          necessitatibus tempore totam nulla provident exercitationem culpa sed
          voluptate eum debitis consequatur nisi suscipit pariatur, blanditiis
          inventore minus. Quibusdam dolores veritatis natus explicabo labore!
          Dolore ab iusto voluptatem voluptate molestiae, aliquid est
          exercitationem itaque esse! Non eos facilis harum repudiandae unde
          ullam culpa ipsa dolor expedita necessitatibus quasi tempore in quis
          totam, ab odit error accusantium et dolorem atque quas voluptatem
          blanditiis facere. Eos voluptates suscipit reiciendis delectus, fugiat
          asperiores placeat animi nulla ut illo quis praesentium accusantium
          hic at iure laudantium mollitia eius.
        </div>
        <div class="tab2" :style="heightStyle">
          catsredirsarea[T] Lorem ipsum, dolor sit amet consectetur adipisicing
          elit. Vero sapiente ratione molestias deleniti maiores totam hic unde
          commodi voluptatibus dolorum nemo doloribus, omnis ducimus sit id ex
          beatae earum corrupti soluta saepe quidem sequi! Optio, magnam? Harum,
          animi quibusdam blanditiis itaque exercitationem earum! Ex fugit
          doloribus enim iure? Provident, dignissimos? Nostrum at beatae aut
          iure dolores aliquid illo ratione debitis, alias praesentium quae
          maiores, cum quas in nemo! Eius magni magnam aliquid dolorem provident
          maiores quae quaerat quia numquam rerum similique odio, laborum ipsum
          delectus sapiente porro ducimus tenetur! Ducimus praesentium a
          tenetur, assumenda distinctio cumque unde vitae eius ab. Lorem ipsum
          dolor sit, amet consectetur adipisicing elit. Laborum, tempora cumque
          repudiandae facilis deleniti aperiam similique iure ipsum quae, magni
          voluptatem expedita, harum et iusto non accusantium repellat! Tempora
          vitae quibusdam rem est excepturi, dolore laboriosam velit molestiae
          veniam, aperiam eum eius maxime numquam cupiditate laudantium
          sapiente? Id suscipit velit odio voluptatibus ipsum dolorem voluptas
          inventore eum. Eveniet dignissimos quas dolorum at blanditiis quaerat
          quo modi? A eum facilis ea deleniti explicabo. Amet laudantium in
          fugit necessitatibus fugiat veniam suscipit similique, vero voluptate
          quos deleniti omnis aspernatur saepe minus voluptatum optio voluptas
          pariatur repudiandae porro! Illo praesentium nesciunt, delectus libero
          labore recusandae deserunt ex quisquam atque, explicabo illum cumque
          modi doloremque! Molestias, ex! Voluptates exercitationem in enim
          fugiat vero cupiditate recusandae nihil iusto? Neque ab voluptas
          blanditiis, repellat repudiandae voluptate sapiente eum exercitationem
          ipsam ad non esse ipsum distinctio quod perspiciatis quae eius? Soluta
          beatae magni numquam asperiores repudiandae id dolor repellat!
          Suscipit autem illo provident reprehenderit aperiam animi iusto ab,
          magni expedita velit repellat fugiat error nobis ipsa ea illum ad
          facere veritatis! Deserunt tempora odio dignissimos, sapiente culpa
          nisi ullam adipisci inventore et fugiat ipsum modi corporis voluptate
          itaque, molestias molestiae, similique doloribus officia! Eaque nulla
          sapiente aliquid recusandae repellendus quis eveniet nihil maiores!
          Ipsum, natus consequatur vitae soluta asperiores quam minus
          repudiandae libero iusto ea placeat repellendus officia ratione
          architecto quae a unde. Ut vitae laborum eius sed, incidunt architecto
          sit, esse quaerat explicabo harum animi provident, porro eos dolores!
          Vel eos temporibus itaque, ut error soluta illo dolorem dolorum quia
          suscipit ex, minima qui enim dolore aperiam. Delectus ab nobis maxime
          esse dicta eveniet facere sunt eius inventore ea voluptas vitae
          sapiente libero, exercitationem vero neque officiis laborum deserunt
          veniam! Voluptas nisi eveniet delectus aperiam illo fugiat sint
          consequuntur voluptates nobis ab mollitia dolorem fuga exercitationem
          magnam officiis, quisquam numquam sunt sapiente pariatur asperiores
          perspiciatis amet. Cum, quam tempore. Enim sit quo commodi, unde rerum
          ad asperiores amet cupiditate quidem hic delectus. Quidem laudantium
          reiciendis similique tenetur ipsum veritatis, sequi consectetur neque
          minima quas ducimus aperiam amet ex, sit dolorum? Fuga deserunt sed
          quam quo excepturi iusto minima, dolore modi nulla tempora suscipit
          dolorem doloremque mollitia cum corrupti odit dolores eveniet
          laudantium vel corporis porro asperiores esse voluptatibus? Quidem,
          quas ut! Voluptas facere, culpa corporis incidunt laborum alias
          facilis soluta adipisci, eveniet porro, eos dolores. Est explicabo
          laborum perferendis fugiat corporis vitae dolorem quibusdam
          consectetur sint earum optio officiis tempora illum molestias nobis
          dolor necessitatibus, sunt provident repellendus quas. Fugit
          voluptatem, magnam veritatis quae sunt expedita nemo debitis in
          necessitatibus, ipsam deserunt dolores corporis explicabo qui dolore.
          Tempora, ex. Harum, rerum quibusdam facere reiciendis iusto maxime?
          Totam, officiis. Officiis similique reiciendis sit labore, repellat
          accusantium ducimus? Vel perspiciatis quibusdam voluptatum ab facilis
          debitis error sunt, iste doloribus non ipsam eos at qui, architecto
          consectetur quia eius inventore. Facilis optio, voluptates sunt
          ratione, quis veritatis tempora ducimus voluptatibus provident ad vel
          ut sequi veniam quos ipsa in, placeat asperiores doloribus? Eaque nisi
          quae nam fugit facilis rem laudantium sit, labore reprehenderit
          cupiditate consequuntur obcaecati nobis accusantium similique, ad,
          officia tenetur! Vitae fugit eum tenetur excepturi! Ducimus, quae?
          Voluptatem amet recusandae eaque iste ad suscipit eligendi voluptas
          non commodi exercitationem distinctio velit quos, repudiandae
          architecto pariatur inventore cupiditate doloremque officia, hic
          maxime veritatis ea! Dicta accusamus sapiente alias debitis eum
          perferendis tempore harum aspernatur earum inventore sed impedit
          distinctio placeat quos consequuntur, veritatis, officia ut optio
          facere ducimus error modi praesentium. Tempora natus sequi, vero
          consectetur necessitatibus repudiandae autem blanditiis fuga
          quibusdam, sapiente quo voluptatum quam placeat dolores. Blanditiis
          ipsum dicta error quasi dolore. Officiis aliquam illum ut vero
          explicabo suscipit, quae praesentium neque ipsam atque rerum
          reiciendis delectus similique distinctio at earum omnis quisquam nobis
          incidunt! Alias exercitationem quasi modi, ad consequatur accusamus
          eligendi officiis dolorem similique deleniti veritatis animi. Sit iste
          adipisci dolore? Sequi aperiam laudantium, nihil asperiores sint ad
          doloribus repellendus iure quae sit totam mollitia officia assumenda
          rem ullam in et, eligendi quibusdam reprehenderit magni rerum
          consequatur veritatis cumque suscipit. Id nihil inventore dolorum
          delectus! Aut repellat a nostrum ab, possimus ut reprehenderit, esse,
          quisquam eum culpa dolores consequatur veritatis tenetur laboriosam
          quo! Voluptates dolor possimus inventore voluptatum incidunt? Atque
          iste iure a neque nam, architecto quia? Quaerat repudiandae
          repellendus voluptates dicta obcaecati et. Sint temporibus dignissimos
          nisi unde itaque, qui nam asperiores magnam illo, sed dolorem! Ab
          corporis nemo placeat quisquam minus fugiat obcaecati unde inventore.
          Modi minus vitae sequi nesciunt doloribus enim quis aut quos
          repudiandae commodi odio officia amet molestias rerum, temporibus
          reiciendis, libero ad dolor earum incidunt velit a? Quia praesentium
          beatae debitis sapiente qui? Debitis corporis distinctio explicabo,
          commodi, fuga obcaecati, cupiditate eaque ipsam soluta pariatur
          deleniti. Eveniet voluptates fugiat eius quam ut consectetur repellat,
          velit dignissimos consequuntur odio temporibus, sint alias nam cumque
          ullam sed natus, quo adipisci recusandae. Vel quibusdam iusto aperiam
          corporis quidem minus dolore fuga, fugiat commodi iure praesentium
          dolorem, placeat ut ad molestiae beatae repellendus eum distinctio
          ducimus consequuntur reiciendis consequatur dolor? Esse in ex
          voluptate illo explicabo vel voluptatibus quidem eveniet rerum, quos
          reiciendis. Modi velit neque pariatur laborum exercitationem suscipit
          placeat voluptas consequatur fugit quo error sequi officia dolorum
          optio molestiae ut, dignissimos culpa praesentium non in voluptate.
          Voluptas nesciunt tenetur error non impedit nostrum, voluptate,
          blanditiis et quidem labore exercitationem ab eius quaerat recusandae
          veritatis quasi explicabo fuga eum aliquam doloremque nisi mollitia?
          Possimus suscipit tempora odio alias sint libero nesciunt in illo
          voluptatem doloribus? Voluptatibus laboriosam corporis obcaecati! Unde
          minima eaque, distinctio omnis consequatur iste. Molestiae molestias
          doloribus quisquam cupiditate consequatur assumenda ratione
          doloremque! A nesciunt, eligendi aspernatur, tenetur iure amet
          excepturi unde ipsum, cum eaque sapiente. Voluptas, officia. Ut ipsam
          amet expedita provident illum suscipit natus omnis cum sapiente
          repellendus ipsa quibusdam libero, porro dolore illo velit odit vitae
          quae! Eligendi sit et ducimus earum, quis magni tempora qui recusandae
          odio porro esse quam neque deleniti enim dolorem alias voluptas cumque
          incidunt perspiciatis obcaecati atque. Dolorem sequi expedita eum
          optio explicabo perspiciatis accusamus nostrum? Et aperiam sed
          cupiditate? Dolores.
        </div>
        <div class="tab3" :style="heightStyle">
          checkboxarea[T] Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Aliquam quod ratione totam perferendis tempora necessitatibus
          dolorem, atque unde, aut assumenda veritatis tempore facere itaque
          ipsa consequatur vitae voluptatem qui nisi voluptate commodi mollitia
          alias excepturi. Aliquam sint expedita, nemo illum nostrum quae! Ex,
          fugiat optio. Impedit molestias fugiat totam tempore incidunt facere.
          Assumenda quod sunt tempora sed pariatur, consequuntur ducimus nisi
          quibusdam, ipsa vitae maxime recusandae sequi repudiandae fugit nobis
          ea. Fugiat voluptatum ipsam quod libero unde delectus architecto neque
          perspiciatis blanditiis, distinctio aut exercitationem porro, alias
          nisi velit pariatur reprehenderit iusto saepe aliquam, nesciunt
          cupiditate. Nostrum et atque consequuntur? Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Iusto recusandae distinctio aspernatur
          hic quo ratione ducimus sequi quisquam quaerat autem impedit cumque
          consectetur, corporis voluptatum nulla laboriosam cupiditate quidem?
          Fugit, debitis, architecto ullam quis corporis sed ratione soluta quia
          aperiam sunt eaque aliquam suscipit officia mollitia enim. Alias nemo
          odit corporis assumenda distinctio eaque, sequi exercitationem! Sequi
          voluptate consequatur temporibus totam aliquam nulla dolorum assumenda
          nemo, nihil dolor repellendus facilis animi vero, eligendi rerum
          molestias. Eius dolorum omnis officiis doloremque cumque eveniet earum
          dicta laboriosam consequatur repellat in voluptate soluta accusamus
          ea, mollitia, nobis architecto enim! Aut quidem ea nostrum illo
          cupiditate ut quisquam necessitatibus nesciunt, hic fugiat id soluta
          distinctio autem in sit cum doloribus dolorem dolorum veritatis. Fuga
          velit vitae dicta aperiam! Aliquam itaque nostrum pariatur sapiente
          inventore recusandae numquam, repellendus natus, fugiat non, sed
          omnis! Suscipit odit nemo fugit ipsam repudiandae quae nulla eius
          saepe alias? Ea sed officiis voluptatibus libero cum, eaque repellat
          perspiciatis magni minus quasi numquam enim fugit accusamus fugiat
          ratione aspernatur sunt excepturi! Possimus, maiores. Assumenda
          cupiditate dicta sit veniam, ducimus tempore expedita eum maxime
          pariatur odit amet ipsam harum est laborum? Aliquam deserunt commodi
          odio voluptates! Ipsa neque magnam ad repellat eligendi velit maiores
          doloribus error voluptatum? Sequi, aut nesciunt dolores ex natus
          eveniet, cupiditate numquam minus animi tempora aliquid, quisquam
          tempore cumque sunt quod consectetur assumenda at? Nostrum cum iure
          veritatis suscipit nisi quidem consequuntur assumenda vitae, fuga in
          at ut excepturi incidunt dicta maxime! Praesentium commodi modi
          officiis nam natus blanditiis, magni rem, consectetur reiciendis
          repudiandae mollitia aliquid sequi, sint voluptatibus ratione sit
          error dignissimos distinctio laboriosam? Architecto, eum animi. Libero
          labore, quae iste aut rerum ex sunt consequuntur soluta, quos
          doloribus reiciendis? Distinctio doloremque ea velit eius sapiente
          repudiandae aperiam dicta odit recusandae aspernatur necessitatibus
          corporis hic veniam cupiditate quod corrupti voluptatibus maxime,
          perspiciatis beatae illo consequatur similique! Accusamus hic natus
          dolore rem quaerat id corporis, voluptate officiis aut architecto
          laborum similique, illo quis error nulla dolorem, voluptatibus et odio
          sunt non! Veritatis eaque vero eveniet molestiae tenetur optio maiores
          delectus, sint iste similique libero quod. Consequatur voluptatem sed
          ipsam nobis libero veniam error cum natus? Laboriosam laudantium quo
          eaque consectetur, praesentium, quae molestiae maiores sed, sequi unde
          optio. Dignissimos ullam eum modi fugiat dolore dolorum recusandae
          unde dolores corporis vitae doloribus velit provident nobis veniam
          consectetur obcaecati odit eos quos voluptas commodi, rerum fugit ea
          consequatur quod! Rem maxime repudiandae aspernatur ea error animi
          ullam, repellat vitae numquam nulla quam quas debitis molestiae quidem
          quo repellendus nobis in sapiente cum similique perspiciatis ipsa!
          Perferendis expedita eaque distinctio repellat qui. Labore omnis
          corrupti neque animi quis error illo at recusandae atque, quisquam
          provident fugiat ipsam dolores id nisi nihil aliquam temporibus iste
          repellendus. Ad esse perferendis officiis possimus mollitia aliquid,
          numquam eum aut, ullam maxime incidunt non voluptatibus debitis iusto
          asperiores vel suscipit quo. Ipsa accusamus quae rem magni odio
          reprehenderit quibusdam praesentium, assumenda ab cumque corporis
          adipisci aperiam necessitatibus ducimus et? Autem rem, dignissimos hic
          dicta libero voluptates animi, unde a itaque accusamus quae facere
          consectetur vitae harum aperiam expedita totam quasi! Corporis maxime,
          laborum dolore sapiente enim eius possimus amet nam! A vel assumenda
          reprehenderit id maiores modi quam vitae non alias eum debitis
          possimus minima, quos nulla quo tempora impedit magnam laboriosam nemo
          corporis rerum recusandae harum tempore. Perferendis ullam quasi
          tenetur suscipit magnam alias non, nisi at cupiditate quae est
          praesentium mollitia. Harum necessitatibus eum alias impedit? At modi
          aliquam, quam quasi quis autem praesentium? Quas doloremque, laborum
          rem placeat quos asperiores id animi adipisci magni sunt, rerum ut
          commodi laboriosam temporibus nihil vero ratione reprehenderit.
          Consectetur aliquid animi, accusantium, obcaecati sint quisquam velit
          accusamus necessitatibus id et dolores nisi quae voluptates esse ab
          nam saepe facilis, sit atque commodi modi recusandae delectus quo a!
          Ipsum tempore soluta laborum expedita aspernatur, eaque ea modi
          assumenda numquam ipsa. Maiores architecto fugit quae esse cum maxime,
          corrupti quos nesciunt! Maiores, doloribus. Repellendus, quae saepe
          suscipit repellat recusandae facilis maxime delectus illo reiciendis
          impedit ullam aliquam soluta mollitia quam cum architecto aliquid
          repudiandae quod, in maiores nemo sunt ut quasi porro! Aperiam non
          laudantium tempora itaque, aliquam voluptates, possimus dolore quod ea
          repellendus iure ex repudiandae unde architecto fugiat omnis optio
          recusandae harum quis provident. Quod tenetur adipisci esse nesciunt
          earum pariatur, ex ducimus, soluta dignissimos quae eum suscipit
          reiciendis, perspiciatis temporibus? Illum officia vero aperiam culpa
          modi ad deserunt quam voluptate aliquid minus quaerat, fugiat
          consectetur sed nam aliquam voluptatibus animi ratione! Unde, culpa
          adipisci libero laborum blanditiis quibusdam nihil sed fugiat expedita
          quam, voluptatem saepe. Sit, aut reiciendis obcaecati architecto
          consequuntur quisquam fugiat ipsum dignissimos voluptatem amet?
          Aliquam cupiditate repellat libero. Molestias facilis sed error iusto
          minus beatae provident praesentium odit corrupti esse accusantium
          natus eaque illo quibusdam deleniti, quas dolorem dolore. Vel quas
          aspernatur odio inventore eum, repellat porro ratione, dolore id,
          harum obcaecati autem! Dolore illum laudantium officiis aliquid
          molestias saepe blanditiis fugit nihil dicta, quo adipisci ab eius
          modi cumque est natus harum laborum minima. Tenetur aliquam odio
          perferendis tempore at voluptates dicta. Nisi obcaecati asperiores
          quas! Quae nulla corrupti tempora non dolorum, similique odio ipsam
          dolore sint dolorem ut, itaque ullam tempore cupiditate dicta.
          Voluptate rerum cupiditate adipisci similique quibusdam illum ut
          praesentium iusto eos placeat, obcaecati molestiae earum reiciendis
          labore commodi molestias eaque consequuntur laborum, recusandae odit
          autem asperiores eveniet qui dolorum? Fuga, expedita provident quis
          molestiae nam reprehenderit vitae in rerum deleniti facilis id ipsum
          nesciunt placeat temporibus saepe aliquam dolor officiis nulla rem!
          Illum quia architecto consectetur animi magnam tenetur asperiores
          corrupti consequuntur in. Exercitationem, adipisci molestiae dolorem
          dolores autem qui obcaecati veritatis iste excepturi modi quo ipsa
          magni ipsum officiis quibusdam aut a tempore. Assumenda, quo accusamus
          ea, quaerat dolorem beatae optio illum quasi facilis possimus aliquam,
          quam porro. Fugiat unde dolor iusto placeat in assumenda, culpa sunt
          quaerat sed. Inventore accusantium harum quam veritatis cumque ullam
          atque pariatur totam ratione accusamus doloribus, porro soluta sed
          obcaecati minima magnam in sequi est eos? Delectus officiis magni eos
          dolore.
        </div>
        <div class="tab4" :style="heightStyle">
          maininfoarea[T] Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Nulla sequi autem iure vitae a quos et temporibus, totam
          voluptas laboriosam, eveniet dolor? Praesentium dolore aut nisi
          laborum fugiat ipsa enim beatae, fuga dolorum ut, non, vero alias id
          dolores qui facilis. Hic animi dicta, cupiditate quos, magnam
          veritatis aliquam necessitatibus iste sapiente beatae rerum a eligendi
          harum repellat alias culpa mollitia aspernatur earum suscipit nemo
          quasi quas voluptate incidunt. Deserunt dolor corporis architecto
          illum eum non cupiditate. Dolorum ex expedita quae. Incidunt
          blanditiis alias qui at corporis ab corrupti expedita, aliquam
          doloribus culpa perferendis, veritatis quo explicabo mollitia minima
          ducimus. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Quisquam quidem expedita nihil adipisci sapiente aliquid, voluptatum
          quam! Tempore modi id eos nisi veritatis, rerum enim praesentium.
          Illum, quis! Quis nostrum magnam pariatur, consequatur alias ullam
          adipisci facere quasi error ducimus saepe labore minus iure fuga
          cumque dolores tempore distinctio! Perspiciatis quod id, beatae
          officia rem et repudiandae doloremque sapiente sunt. Est autem
          praesentium cum temporibus dolor beatae, hic vel? Magni corrupti
          expedita culpa? Laboriosam iste ipsa officiis magni non aperiam eum
          voluptatem rem quisquam! Aliquid repellendus impedit nam amet harum,
          sapiente inventore assumenda quis nihil magnam nesciunt vel enim
          expedita minima error vero autem laborum eum at natus quo ut
          voluptatum? Sint mollitia animi enim facilis exercitationem nam
          repellendus repellat officiis voluptatem magnam quasi rerum eligendi
          provident ut vel, saepe cum aspernatur! Eveniet, alias aliquid
          asperiores optio est nemo magni mollitia aperiam! Inventore, ratione!
          Deleniti molestiae aut voluptate quia pariatur repellat inventore
          cupiditate, corporis accusamus maxime placeat sapiente! Corporis unde
          quisquam, fuga accusamus tempore et excepturi! Repudiandae sequi
          laudantium iste accusamus ad amet libero in dignissimos exercitationem
          iure temporibus, necessitatibus, eaque vel vitae consequatur totam cum
          eum odio, nemo aliquam rem. Suscipit iure inventore architecto rem
          deleniti consequuntur illum nam ab sit, quae placeat eveniet
          veritatis, quasi assumenda facere quos corrupti animi laborum neque
          amet mollitia voluptatibus magni, aliquam harum. Excepturi vel ex
          placeat omnis inventore ab consequuntur sint, repudiandae corrupti,
          qui aperiam dignissimos quisquam vero vitae esse, amet libero sed
          voluptatibus ipsa mollitia eligendi molestiae. Placeat architecto
          delectus vitae dolorem, amet nisi, accusamus quos facere ipsum quas
          omnis veniam. Molestias doloremque libero consectetur earum inventore
          repudiandae quod est ut dolores placeat nostrum porro ea nobis totam a
          veniam architecto sint, natus consequuntur labore nisi! Nostrum
          cupiditate in voluptatibus modi aspernatur sapiente, iste vero vitae
          cumque? Distinctio eum aliquid aspernatur quidem dolorum ut molestias
          exercitationem sint adipisci reiciendis sit dolore beatae illum culpa
          laborum, omnis sed sequi tenetur doloremque? Itaque incidunt
          recusandae ad deleniti atque praesentium, numquam sit quod vel dicta
          blanditiis iusto consectetur sunt cupiditate tempore rem soluta, culpa
          magnam eos suscipit fuga distinctio qui nisi assumenda? Animi quis
          rerum a fuga quae soluta suscipit, maiores voluptates error velit odio
          ab! Et, quos! At, praesentium velit a tenetur possimus mollitia
          quisquam corrupti consectetur aliquam dolorum ea? Suscipit praesentium
          nisi ratione eaque obcaecati aperiam ad voluptatibus soluta labore
          molestias similique, esse officiis laborum minima ea id unde nemo
          perferendis rem possimus non reprehenderit dicta quis? Cum minus ex
          earum, error reiciendis voluptates quisquam? Reiciendis sint pariatur
          ducimus corporis adipisci possimus aperiam consequuntur ex laborum ad
          modi, repellendus vero harum excepturi placeat. Voluptas qui quo
          repellat esse inventore repudiandae sit? Expedita vitae sunt quod est!
          Consectetur maxime laborum nulla totam, voluptates veniam, nostrum
          quia fuga possimus corporis neque maiores quos perferendis, laudantium
          rerum quisquam fugiat impedit eaque ipsa consequuntur rem quidem odit!
          Cum porro eaque deserunt amet facilis asperiores totam veniam magnam
          inventore atque assumenda animi minus ab doloremque, in dolor quos
          culpa accusamus! Alias laudantium esse in, quo suscipit molestiae
          commodi ipsa nisi aperiam, eligendi earum ex cumque soluta facere ad
          unde illo? Fugiat iusto assumenda asperiores error incidunt
          blanditiis, odit voluptatum sit quos molestias nam earum repellat
          facilis! Laboriosam ab at dicta sed sit commodi, adipisci dignissimos
          non omnis a! In atque voluptas quas aspernatur labore deleniti error
          sit eos culpa, sed, sunt temporibus ducimus consequatur laudantium
          laboriosam veritatis id. Voluptatum molestiae soluta deserunt fuga,
          totam doloremque omnis pariatur, maxime, voluptate cum placeat debitis
          libero veniam dicta quod autem provident. Non consequatur fuga harum
          nesciunt nisi exercitationem atque eum est soluta esse quis illum,
          vero asperiores dolores et fugit necessitatibus odit voluptas
          explicabo nulla. Veniam, itaque exercitationem molestiae maxime nam
          quisquam voluptates vitae expedita nesciunt est incidunt illo, quis
          magnam reiciendis assumenda inventore cupiditate nostrum ad voluptate.
          Assumenda voluptatibus rerum unde rem neque sit at molestiae ut, nisi
          natus dignissimos officia recusandae animi, enim magnam aspernatur quo
          nihil illo nostrum blanditiis fuga dolores debitis ex necessitatibus.
          Voluptate, in! Natus dolorum, suscipit ut asperiores officia dolores
          quidem eum obcaecati tenetur quae saepe quia laborum facilis
          distinctio illo mollitia esse exercitationem? Reprehenderit expedita
          non libero nesciunt? Itaque ipsum modi doloribus dolor ut assumenda
          culpa sed ab expedita. Facere, sint consequatur itaque aut iure
          mollitia hic consequuntur at ab excepturi explicabo, officia autem.
          Iste sapiente maxime voluptas id nam praesentium dicta consectetur.
          Ratione voluptatem voluptas sint fugiat est aut similique, numquam
          reprehenderit architecto recusandae quaerat, reiciendis ab esse, omnis
          pariatur ullam soluta laborum nisi eos consequatur quo? Eius officia
          dolorum, incidunt molestias sed est. Earum, saepe fugiat, corrupti
          possimus expedita dolor necessitatibus libero facilis ratione ab
          eveniet, tempore in quia. Non culpa voluptates exercitationem, quo
          ipsa et delectus ipsam perferendis officia. Dolorem, eveniet? Sed
          adipisci molestiae iure architecto deserunt sapiente eos enim
          voluptatem nobis incidunt, nesciunt doloremque corporis aliquid
          nostrum aspernatur ad maiores minus, sit harum quas voluptate. Aliquid
          ex odit quisquam ratione dicta placeat sapiente excepturi vitae culpa
          earum veritatis unde, dolor debitis perferendis sunt et aspernatur
          iusto fuga maiores ea facere nesciunt. Esse praesentium placeat,
          corporis dolore at a rem sapiente, perspiciatis quibusdam amet cumque
          quasi blanditiis delectus est porro fugiat, consectetur eius animi?
          Odit quisquam laborum debitis. Veritatis voluptatem harum aliquam
          officiis dolore aut possimus cumque provident eligendi beatae nemo,
          velit vitae cum non quia suscipit. Eligendi omnis impedit laboriosam
          eos, magni distinctio, eaque itaque quibusdam nisi asperiores quidem
          architecto aspernatur tempore, dolor perspiciatis perferendis quasi
          ratione. Accusamus iure vel optio cumque in debitis beatae possimus,
          ea recusandae natus quibusdam delectus non! Amet itaque perferendis
          vero deserunt iure officia enim similique dolor qui quis magnam
          reprehenderit velit, assumenda corporis quia modi et tempora dolore
          sunt nemo asperiores. Ratione exercitationem tempora aut voluptates!
          Eligendi autem sint quidem maxime et? Quae earum consequatur assumenda
          iste odit eaque explicabo, incidunt nesciunt at perspiciatis quisquam
          delectus repellendus omnis, sequi perferendis. Non natus similique,
          atque dolores impedit a sit exercitationem culpa sunt ex reiciendis,
          animi rem porro est architecto repellendus omnis error laborum totam
          cupiditate. Accusamus fugit repellendus aperiam, esse accusantium
          veritatis porro officiis?
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {
  inject,
  ref,
  watchEffect,
  nextTick,
  onMounted,
  onBeforeUnmount,
  computed
} from 'vue'
// import { useI18n } from 'vue-i18n/index'
// const { t } = useI18n({})
const global = inject('global')
const tab2 = ref(null)
const label4 = ref(null)
const tabbed = ref(null)
const scrollboxContainerHeight = ref(300)

// switch to tab2, when leaving mobile mode
watchEffect(() => {
  if (tab2.value && !global.state.mobileMode) {
    tab2.value.checked = true
  }
})

watchEffect(() => windowResized(global.state.mobileMode))

async function windowResized() {
  await nextTick()
  scrollboxContainerHeight.value =
    tabbed.value.getBoundingClientRect().height -
    label4.value.getBoundingClientRect().height
}

const heightStyle = computed(function () {
  return {
    height: scrollboxContainerHeight.value + 'px'
  }
})

onMounted(() => {
  window.addEventListener('resize', windowResized)
  windowResized()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', windowResized)
})
</script>

<style scoped>
.tabbed section {
  display: block;
  margin-left: 0;
  clear: both;
}

.tabbed > input,
.tabbed section > div {
  display: none;
}

/* .tabbed section > div { */
/* padding: 0; */
/* width: 100%; */
/* border: 1px solid black; */
/* background: #fff; */
/* line-height: 1.5em; */
/* letter-spacing: 0.3px; */
/* color: #444; */
/* } */

#tab1:checked ~ section .tab1,
#tab2:checked ~ section .tab2,
#tab3:checked ~ section .tab3,
#tab4:checked ~ section .tab4 {
  display: block;
}

nav label {
  float: left;
  padding: 3px 3px;
  border-top: 1px solid black;
  border-right: 1px solid black;
  background: #ddd;
  color: black;
  font-size: 85%;
  border-bottom: 1px solid black;
}

nav label:nth-child(1) {
  border-left: 1px solid black;
}
nav label:hover {
  filter: invert(0.25);
}
nav label:active {
  background: #ffffff;
}

#tab1:checked ~ nav label[for='tab1'],
#tab2:checked ~ nav label[for='tab2'],
#tab3:checked ~ nav label[for='tab3'],
#tab4:checked ~ nav label[for='tab4'] {
  background: mistyrose;
  color: black;
  position: relative;
}

/* #tab1:checked ~ nav label[for='tab1']:after,
#tab2:checked ~ nav label[for='tab2']:after,
#tab3:checked ~ nav label[for='tab3']:after,
#tab4:checked ~ nav label[for='tab4']:after {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  background: white;
  left: 0;
} */
.container {
  height: 100%;
}
.tabbed {
  height: 100%;
}
.tab1,
.tab2,
.tab3,
.tab4 {
  overflow-y: auto;
}
</style>
